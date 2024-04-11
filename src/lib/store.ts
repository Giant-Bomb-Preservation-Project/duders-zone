import { writable } from 'svelte/store'

import { VideoSource } from '$lib/data'

export const preferredSource = writable(VideoSource.InternetArchive)
