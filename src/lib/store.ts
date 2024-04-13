import { writable } from 'svelte/store'

import { VideoSource } from '$lib/data'

export const preferredSource = writable(
	localStorage.getItem('preferredSource') || VideoSource.InternetArchive
)

preferredSource.subscribe((val) => localStorage.setItem('preferredSource', val))
