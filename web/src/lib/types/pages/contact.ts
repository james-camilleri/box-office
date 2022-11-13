import { Page } from './page'
import { PortableTextBlock } from '@portabletext/types'

export interface Contact extends Page {
  _type: 'pageContact'
  title: string
  subtitle: string
  text: PortableTextBlock[]
  email: string
  number: string
  address: string
  mapPoint: {
    _type: 'geopoint'
    lat: number
    lng: number
    alt?: number
  }
}
