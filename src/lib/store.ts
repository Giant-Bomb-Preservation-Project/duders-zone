import { writable } from 'svelte/store'

import { VideoSource } from '$lib/data'
import { Theme, VideoListMode } from '$lib/types'
import { VideoListSorting } from './types'

// Create a store for browsers
const createBrowserStore = <T extends string>(key: string, defaultValue: T) => {
	const store = writable((localStorage.getItem(key) as T) || defaultValue)

	// Store the token in LocalStorage whenever it´s updated
	store.subscribe((val) => {
		if (!localStorage) return
		if (!val) return localStorage.removeItem(key)
		localStorage.setItem(key, val)
	})

	return store
}

// Create a store for Node (only used when building the site)
const createNodeStore = <T extends any>(defaultValue: T) => writable(defaultValue)

// The preferred video source
export const preferredSource =
	typeof localStorage === 'undefined'
		? createNodeStore(VideoSource.InternetArchive)
		: createBrowserStore('preferredSource', VideoSource.InternetArchive)

// Browser theme
let defaultTheme = Theme.Light
if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	defaultTheme = Theme.Dark
}
export const theme =
	typeof localStorage === 'undefined'
		? createNodeStore(defaultTheme)
		: createBrowserStore<Theme>('theme', defaultTheme)

// How to show the video list
export const videoListMode =
	typeof localStorage === 'undefined'
		? createNodeStore(VideoListMode.List)
		: createBrowserStore<VideoListMode>('videoListMode', VideoListMode.List)

// How to sort the video list
export const videoListSorting =
	typeof localStorage === 'undefined'
		? createNodeStore(VideoListSorting.NewestFirst)
		: createBrowserStore<VideoListSorting>('videoSorting', VideoListSorting.NewestFirst)
