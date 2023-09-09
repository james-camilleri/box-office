import { writable } from 'svelte/store'

export const selectedShowId = writable<string | undefined>()
