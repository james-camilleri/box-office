import type { Seat } from 'shared/types'
import { writable } from 'svelte/store'

export const selection = writable<Map<string, Seat>>(new Map<string, Seat>())
export const unavailable = writable<Set<string> | undefined>()
export const pricing = writable<Map<string, string>>(new Map<string, string>())
