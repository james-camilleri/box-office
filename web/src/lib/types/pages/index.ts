export type { Page } from './page'

export type { Sample } from './sample'
export type { Contact } from './contact'

export const PAGES = {
  SAMPLE: 'pageSample',
  CONTACT: 'pageContact',
} as const

export type PageId = typeof PAGES[keyof typeof PAGES]
