import { browser } from '$app/environment'
import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params, url }) => {
	let pageNumber: number = 1
	if (browser && url.searchParams.get('page')) {
		pageNumber = parseInt(url.searchParams.get('page') ?? '1') || 1
	}

	return {
		pageNumber,
		videos: dataStore.getVideos(),
	}
}) satisfies PageLoad
