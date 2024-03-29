import {
  FaExclamationTriangle,
  FaGlobe,
  FaPercentage,
  FaRegEnvelope,
  FaTheaterMasks,
  FaTicketAlt,
  FaUserFriends,
  FaWrench,
} from 'react-icons/fa'
import { StructureBuilder } from 'sanity/desk'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Bookings')
        .icon(FaTheaterMasks)
        .child(
          S.documentList().title('Bookings').filter('_type == "booking"').schemaType('booking'),
        ),
      S.listItem()
        .title('Customers')
        .icon(FaUserFriends)
        .child(
          S.documentList().title('Customers').filter('_type == "customer"').schemaType('customer'),
        ),
      S.listItem()
        .title('Tickets')
        .icon(FaTicketAlt)
        .child(S.documentList().title('Tickets').filter('_type == "ticket"').schemaType('ticket')),
      S.divider(),
      S.listItem()
        .title('Configure')
        .icon(FaWrench)
        .child(S.document().title('Configure').schemaType('pageConfigure').documentId('configure')),
      S.listItem()
        .title('Website')
        .icon(FaGlobe)
        .child(S.document().title('Website').schemaType('pageWebsite').documentId('website')),
      S.listItem()
        .title('Email')
        .icon(FaRegEnvelope)
        .child(S.document().title('Email').schemaType('pageEmail').documentId('email')),
      S.listItem()
        .title('Discounts')
        .icon(FaPercentage)
        .child(
          S.documentList().title('Discounts').filter('_type == "discount"').schemaType('discount'),
        ),

      S.divider(),
      S.listItem()
        .title('Internal')
        .icon(FaExclamationTriangle)
        .child(
          S.list()
            .title('Internal')
            .items([
              S.listItem()
                .title('Shows')
                .child(
                  S.documentList().title('Shows').filter('_type == "show"').schemaType('show'),
                ),
              S.listItem()
                .title('Pricing Tiers')
                .child(
                  S.documentList()
                    .title('Pricing Tiers')
                    .filter('_type == "priceTier"')
                    .schemaType('priceTier'),
                ),
              S.listItem()
                .title('Sections')
                .child(
                  S.documentList()
                    .title('Sections')
                    .filter('_type == "section"')
                    .defaultOrdering([
                      {
                        field: '_createdAt',
                        direction: 'asc',
                      },
                    ])
                    .schemaType('section'),
                ),
              S.listItem()
                .title('Rows')
                .child(
                  S.documentList()
                    .title('Rows')
                    .filter('_type == "row"')
                    .defaultOrdering([
                      {
                        field: '_createdAt',
                        direction: 'asc',
                      },
                    ])
                    .schemaType('row'),
                ),
              S.listItem()
                .title('Seats')
                .child(
                  S.documentList()
                    .title('Seats')
                    .filter('_type == "seat"')
                    .defaultOrdering([
                      {
                        field: '_createdAt',
                        direction: 'asc',
                      },
                    ])
                    .schemaType('seat'),
                ),
            ]),
        ),
      S.divider(),
    ])
