import { ConfigContext, StructureBuilder } from 'sanity/desk'
import {} from 'react-icons/ri'

export const structure = (S: StructureBuilder, context: ConfigContext) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Seats')
        .icon(undefined)
        .child(S.documentList().title('Seats').filter('_type == "seat"').schemaType('seat')),
      S.listItem()
        .title('Tickets')
        .icon(undefined)
        .child(S.documentList().title('Tickets').filter('_type == "ticket"').schemaType('ticket')),
      S.listItem()
        .title('Shows')
        .icon(undefined)
        .child(S.documentList().title('Shows').filter('_type == "show"').schemaType('show')),
      S.listItem()
        .title('Price Tiers')
        .icon(undefined)
        .child(
          S.documentList()
            .title('Price Tiers')
            .filter('_type == "priceTier"')
            .schemaType('priceTier'),
        ),
    ])
