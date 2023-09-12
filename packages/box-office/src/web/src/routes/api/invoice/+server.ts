import type { Booking } from '$shared/types'

import { error } from '@sveltejs/kit'

import { getLineItem, getTotals, log } from '$shared/utils'

import { DataStore, REQUEST_KEY } from '../data-store.js'
import { stripe } from '../stripe.js'

/*
  This endpoint should be called as a webhook from sanity with the following projection:
  {
    ...,
    'show': show->,
    'seats': seats[]->{
      _id,
      'row': row -> _id,
      'section': row -> section -> _id
    },
    'discount': discount->,
    'customer': customer->
  }
*/

export async function POST({ request, fetch }) {
  try {
    const booking = (await request.json()) as Booking

    const store = new DataStore()
    store.set(
      REQUEST_KEY.CONFIG,
      fetch('/api/config').then((response) => response.json()),
    )

    log.info(
      `Creating invoice for booking ${booking.orderConfirmation}/${booking._id} (${booking.customer.name} <${booking.customer.email}>)`,
    )
    await createInvoice(booking, store)
    log.success('Invoice created successfully')
    await log.flush()

    return new Response()
  } catch (e) {
    log.error('Error creating new invoice')
    await log.flush()
    throw error(500, e)
  }
}

async function createInvoice(booking: Booking, store: DataStore) {
  const customer = booking.customer.stripeId
  const currency = 'EUR'

  const { vat5, vat0 } = await getTaxRates()
  const { id } = await stripe.invoices.create({
    auto_advance: false,
    customer,
    currency,
    metadata: {
      booking: booking._id,
      transaction: booking.transactionId,
    },
  })
  log.debug(`Stripe invoice "${id}" created`)

  const { show, discount } = booking
  const { priceTiers, priceConfiguration } = await store.get(REQUEST_KEY.CONFIG)

  const sharedInvoiceItemProperties = {
    invoice: id,
    customer,
    tax_rates: [vat5],
    currency,
  }

  const seatItems = booking.seats.map((seat) =>
    getLineItem(seat, show._id, priceTiers, priceConfiguration),
  )

  await Promise.all(
    seatItems.map(({ description, price }) =>
      stripe.invoiceItems.create({
        ...sharedInvoiceItemProperties,
        description,
        amount: Math.floor((price ?? 0) * 100),
      }),
    ),
  )

  const { reduction, bookingFee } = getTotals(
    seatItems.map(({ price }) => price ?? 0),
    discount,
    booking.source === 'website',
  )

  if (discount) {
    await stripe.invoiceItems.create({
      ...sharedInvoiceItemProperties,
      description: `Discount: ${discount.name}`,
      amount: Math.floor(reduction * 100) * -1,
    })
  }

  if (bookingFee) {
    await stripe.invoiceItems.create({
      ...sharedInvoiceItemProperties,
      description: 'Booking fee',
      amount: Math.floor(bookingFee * 100),
      tax_rates: [vat0],
    })
  }

  log.debug('Marking invoice as paid')
  await stripe.invoices.pay(id, {
    paid_out_of_band: true,
  })
}

async function getTaxRates() {
  const { data: taxRates } = await stripe.taxRates.list()

  const vat5 = taxRates.find(
    (taxRate) => taxRate.active && taxRate.display_name === 'VAT' && taxRate.percentage === 5,
  )?.id
  const vat0 = taxRates.find(
    (taxRate) => taxRate.active && taxRate.display_name === 'VAT' && taxRate.percentage === 0,
  )?.id

  if (!vat5 || !vat0) {
    log.error(`Tax rate(s) missing`)
    throw error(500, 'Tax rates missing')
  }

  return { vat5, vat0 }
}
