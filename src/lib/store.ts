import { writable } from 'svelte/store'

import { VideoSource } from '$lib/data'
import { VideoListMode } from '$lib/types'

// Create a store for browsers
const createBrowserStore = (key: string, defaultValue: any) => {
	const store = writable(localStorage.getItem(key) || defaultValue)

	// Store the token in LocalStorage whenever it´s updated
	store.subscribe((val) => {
		if (!localStorage) return
		if (!val) return localStorage.removeItem(key)
		localStorage.setItem(key, val)
	})

	return store
}

// Create a store for Node (only used when building the site)
const createNodeStore = (defaultValue: any) => writable(defaultValue)

// The preferred video source
export const preferredSource =
	typeof localStorage === 'undefined'
		? createNodeStore(VideoSource.InternetArchive)
		: createBrowserStore('preferredSource', VideoSource.InternetArchive)

// How to show the video list
export const videoListMode =
	typeof localStorage === 'undefined'
		? createNodeStore(VideoListMode.List)
		: createBrowserStore('videoListMode', VideoListMode.List)
