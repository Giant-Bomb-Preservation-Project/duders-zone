import { browser } from '$app/environment'
import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'
import type { Video } from '$lib/data'

export const load = (({ url }) => {
	let searchQuery: string | null = browser ? url.searchParams.get('q') : null
	let videos: Video[] = searchQuery ? dataStore.searchVideos(searchQuery) : []

	let pageNumber: number | null =
		browser && url.searchParams.get('page')
			? parseInt(url.searchParams.get('page') ?? '1') || 1
			: null
	return { searchQuery, videos, pageNumber }
}) satisfies PageLoad
