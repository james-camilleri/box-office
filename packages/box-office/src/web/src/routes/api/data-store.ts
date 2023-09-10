import type { ConfigurationFull, Customer, Seat, Show } from '$shared/types'
import type { PortableTextBlock } from 'sanity'

export enum REQUEST_KEY {
  CONFIG,
  CUSTOMER,
  EMAIL_TEXT,
  SEAT_DETAILS,
  SHOW_DETAILS,
}

export class DataStore {
  #cache = new Map<
    REQUEST_KEY,
    Promise<ConfigurationFull | PortableTextBlock[] | Customer | Seat[] | Show>
  >()

  set(key: REQUEST_KEY.CONFIG, value: Promise<ConfigurationFull>): void
  set(key: REQUEST_KEY.EMAIL_TEXT, value: Promise<PortableTextBlock[]>): void
  set(key: REQUEST_KEY.CUSTOMER, value: Promise<Customer>): void
  set(key: REQUEST_KEY.SEAT_DETAILS, value: Promise<Seat[]>): void
  set(key: REQUEST_KEY.SHOW_DETAILS, value: Promise<Show>): void
  set(
    key: REQUEST_KEY,
    value: Promise<ConfigurationFull | PortableTextBlock[] | Customer | Seat[] | Show>,
  ) {
    this.#cache.set(key, value)
  }

  get(key: REQUEST_KEY.CONFIG): Promise<ConfigurationFull>
  get(key: REQUEST_KEY.EMAIL_TEXT): Promise<PortableTextBlock[]>
  get(key: REQUEST_KEY.CUSTOMER): Promise<Customer>
  get(key: REQUEST_KEY.SEAT_DETAILS): Promise<Seat[]>
  get(key: REQUEST_KEY.SHOW_DETAILS): Promise<Show>
  get(
    key: REQUEST_KEY,
  ): Promise<ConfigurationFull | PortableTextBlock[] | Customer | Seat[] | Show> {
    const value = this.#cache.get(key)
    if (!value) {
      throw Error(`${REQUEST_KEY[key]} has not been set`)
    }

    return value
  }
}
