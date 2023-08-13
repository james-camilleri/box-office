function createUniqueIdGenerator() {
  let i = 0

  return (prefix = 'id') => `${prefix}-${i++}`
}

export const uniqueId = createUniqueIdGenerator()
