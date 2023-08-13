interface NavItem {
  text: string
  link: string
  external?: boolean
}

export type RawNavItem = string | NavItem

export function normaliseNavItems(items: RawNavItem[]): NavItem[] {
  return items.map((item) => {
    if (typeof item !== 'string') {
      return { external: item.link.startsWith('http'), ...item }
    }

    return {
      text: item.split('/').slice(-1)[0].replace('-', ' '),
      link: item,
    }
  })
}
