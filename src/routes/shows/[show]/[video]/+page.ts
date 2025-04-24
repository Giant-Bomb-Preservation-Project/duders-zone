import { error } from '@sveltejs/kit'
import { browser } from '$app/environment'
import { dataStore } from '$lib/data'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params, url }) => {
	const show = dataStore.getShowById(params.show)

	if (show === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForShow(show)

	const video = dataStore.getVideoById(params.video)
	if (video === null) throw error(404, 'Not found')

	const pageNumber: number = browser ? parseInt(url.searchParams.get('page') ?? '1') : 1

	return { show, video, videos, pageNumber }
}) satisfies PageLoad

export const entries: EntryGenerator = () => {
	var results: { show: string; video: string }[] = []

	const shows = dataStore.getShows()
	for (const show of shows) {
		const videos = dataStore.getVideosForShow(show)

		results = results.concat(
			videos.map((video) => {
				return { show: show.id, video: video.id }
			})
		)
	}

	return results
}
