import { browser } from '$app/environment'
import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'
import type { Video } from '$lib/data'

export const load = (({ url }) => {
	let searchQuery: string | null = browser ? url.searchParams.get('q') : null
	let videos: Video[] = searchQuery ? dataStore.searchVideos(searchQuery) : []

	return { searchQuery, videos }
}) satisfies PageLoad
