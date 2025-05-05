import { error, redirect } from '@sveltejs/kit'
import { browser } from '$app/environment'
import { base } from '$app/paths'
import { dataStore } from '$lib/data'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params, url }) => {
	const show = dataStore.getShowById(params.show)
	if (show === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForShow(show)

	let video = dataStore.getVideoById(params.video)
	if (video === null) {
		// Try to find the video using the IA ID and redirect to the new ID
		// TODO: Maybe remove this after some time?
		video = dataStore.getVideoByIAId(params.video)
		if (video) {
			redirect(301, `${base}/videos/${params.show}/${video.id}`)
		}
	}

	if (video === null) throw error(404, 'Not found')

	let pageNumber: number | null =
		browser && url.searchParams.get('page')
			? parseInt(url.searchParams.get('page') ?? '1') || 1
			: null

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
