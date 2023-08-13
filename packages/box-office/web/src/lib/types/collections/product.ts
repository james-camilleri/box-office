import { WebImage } from '@james-camilleri/sanity-web-image'
import { PortableTextBlock } from '@portabletext/types'

export interface Product {
  _id: string
  name: string
  image: WebImage
  description: PortableTextBlock[]
  shortDescription?: string
  price: number
  metadata?: any
}
