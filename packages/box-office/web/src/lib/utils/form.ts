import type { Field } from '$lib/types/forms'
import type { ValidationFunction } from '$lib/types/forms/field'

export const RESET_TIMEOUT = 5000

// Taken from https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression.
export const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

// TODO: Localise error text, fix type errors.
export const validations: Record<string, ValidationFunction> = {
  email: (value?: string) => (!EMAIL_REGEX.test(value) ? 'Enter a valid email address' : undefined),
}

export function allFieldsValid(fields: Field[]): boolean {
  return !fields.filter(({ valid }) => !valid).length
}

export function resetFields(fields: Field[]): Field[] {
  return fields.map((field) => ({ ...field, value: '', valid: undefined }))
}

export function postFormData(form: HTMLFormElement, url: string) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
  })
}
