import { writable } from 'svelte/store'

export const selection = writable<Set<string>>(new Set<string>())
export const unavailable = writable<Set<string> | undefined>()
export const pricing = writable<Map<string, string>>(new Map<string, string>())
