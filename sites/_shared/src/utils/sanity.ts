import { customAlphabet } from 'nanoid'

export function createReference(id: string) {
  return {
    _type: 'reference' as const,
    _ref: id,
  }
}

const SANITY_KEY_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
export const generateArrayKey = customAlphabet(SANITY_KEY_ALPHABET, 32)
