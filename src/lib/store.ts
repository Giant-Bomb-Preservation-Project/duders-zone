import { writable } from 'svelte/store'

import { VideoSource } from '$lib/data'
import { VideoListMode } from '$lib/types'

// The preferred video source
export const preferredSource = writable(
	localStorage.getItem('preferredSource') || VideoSource.YouTube
)

// How to show the video list
export const videoListMode = writable(localStorage.getItem('videoListMode') || VideoListMode.List)

preferredSource.subscribe((val) => localStorage.setItem('preferredSource', val))
videoListMode.subscribe((val) => localStorage.setItem('videoListMode', val))
