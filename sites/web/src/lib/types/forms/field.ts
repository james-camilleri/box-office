import type { SvelteComponent } from 'svelte'

type FieldValue = string | boolean | undefined
export type ValidationFunction = (value: FieldValue) => string | undefined

export interface Field {
  name: string
  label?: string
  hint?: string
  type: typeof SvelteComponent | string
  value: FieldValue
  validations?: ValidationFunction[]
  valid?: boolean
}
