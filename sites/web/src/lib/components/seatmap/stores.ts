import { writable } from 'svelte/store'

import { data } from './pricing-data'

export const selection = writable<Set<string>>(new Set<string>())
export const unavailable = writable<Set<string>>(new Set<string>())
export const pricing = writable<Map<string, string>>(new Map<string, string>(Object.entries(data)))
