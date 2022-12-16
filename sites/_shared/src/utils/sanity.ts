export function createReference(id: string) {
  return {
    _type: 'reference' as const,
    _ref: id,
  }
}
