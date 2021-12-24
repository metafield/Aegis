import { writable } from 'svelte/store'

export const currentRound = writable(1)

type Stage = 'TITLE' | 'GAME'
export const stage = writable<Stage>('GAME')
