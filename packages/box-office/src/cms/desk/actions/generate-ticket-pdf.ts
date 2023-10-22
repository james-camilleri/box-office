import type { BookingDocument } from '$shared/types'
import { CONFIG, TICKET_DETAILS } from '$shared/queries'
import { API_VERSION } from '$shared/constants'
import { formatShowDateTime } from '$shared/utils'

import * as pdfMake from 'pdfmake/build/pdfmake'
import 'pdfmake/build/vfs_fonts'

import { DocumentPdfIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { DocumentActionDescription, DocumentActionProps, useClient } from 'sanity'

function evenBreak(text: string) {
  const totalLength = text.length
  const splitString = text.split(' ')

  let line1 = ''
  while (line1.length < totalLength / 2) {
    line1 += splitString.shift() + ' '
  }

  return line1 + '\n' + splitString.join(' ')
}

export function GenerateTicketPdf({
  published,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
  const toast = useToast()
  const client = useClient({ apiVersion: API_VERSION })

  const pdfDefinition = {
    pageSize: 'A6',
    pageOrientation: 'portrait',
    pageMargins: [50, 50, 50, 44],
    background: (_, pageSize) => ({
      svg: `<svg width="${pageSize.width}" height="${pageSize.height}" viewBox="0 0 ${
        pageSize.width
      } ${pageSize.height}"><rect x="10" y="10" width="${pageSize.width - 20}" height="${
        pageSize.height - 20
      }" fill="none" stroke="#000" stroke-width="3" /></svg`,
    }),
  }

  return {
    disabled: !published || !published.valid,
    label: 'Generate ticket PDF',
    icon: DocumentPdfIcon,
    onHandle: async () => {
      const {
        tickets: ticketIds,
        customer: customerRef,
        show: showRef,
        orderConfirmation,
      } = published as BookingDocument

      const customer = await client.getDocument(customerRef._ref)
      const show = await client.getDocument(showRef._ref)
      const config = await client.fetch(CONFIG)

      const tickets = (
        (await client.fetch(TICKET_DETAILS, {
          tickets: ticketIds.map(({ _ref }) => _ref),
        })) as TicketDocument
      ).filter(({ valid }) => valid)

      try {
        pdfMake
          .createPdf({
            ...pdfDefinition,
            content: tickets
              .map((ticket, i) => [
                { qr: ticket._id, fit: 206, margin: [0, 0, 0, 28] },
                { text: config.showName, margin: [0, 0, 0, 3], bold: true, fontSize: 12 },
                {
                  text: formatShowDateTime(show.date, config.timeZone),
                  fontSize: 12,
                },
                { text: evenBreak(config.showLocation), margin: [0, 0, 0, 12], fontSize: 8 },
                {
                  text: [{ text: ticket.seat._ref, bold: true }],
                },
                { text: ticket._id, fontSize: 10, margin: [0, 0, 0, 10] },
                {
                  text: `${customer.name} / ${orderConfirmation}`,
                  fontSize: 8,
                  pageBreak: i !== tickets.length - 1 ? 'after' : undefined,
                },
              ])
              .flat(),
          })
          .download(customer.name)
        toast.push({
          title: 'Tickets PDF generated',
          status: 'success',
        })
      } catch {
        toast.push({
          title: 'Something has gone terribly wrong',
          status: 'error',
        })
      }

      onComplete()
    },
  }
}
