import { persisted } from 'svelte-persisted-store'
import { VideoSource } from '$lib/data'
import { Theme, VideoListMode } from '$lib/types'
import { VideoListSorting } from './types'

// The preferred video source
export const preferredSource = persisted<VideoSource>(
	'preferredSource',
	VideoSource.InternetArchive
)

// Browser theme
let defaultTheme = Theme.Light
if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	defaultTheme = Theme.Dark
}
export const theme = persisted<Theme>('theme', defaultTheme)

// Whether to show the video in W~I~D~E mode
export const wideVideo = persisted('wideVideo', false)

// How to show the video list
export const videoListMode = persisted<VideoListMode>('videoListMode', VideoListMode.List)

// How to sort the video list
export const videoListSorting = persisted<VideoListSorting>(
	'videoSorting',
	VideoListSorting.NewestFirst
)
