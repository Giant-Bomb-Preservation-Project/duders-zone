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
			redirect(301, `${base}/shows/${params.show}/${video.id}`)
		}
	}

	if (video === null) throw error(404, 'Not found')

	const perPage = 24
	let pageNumber: number = 1
	if (browser && url.searchParams.get('page')) {
		pageNumber = parseInt(url.searchParams.get('page') ?? '1') || 1
	} else {
		// Determine which page the current video is on
		for (let i = 0; i < videos.length; i++) {
			if (videos[i].id === video.id) {
				pageNumber = Math.floor(i / perPage) + 1
				break
			}
		}
	}

	return { show, video, videos, pageNumber, perPage }
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
