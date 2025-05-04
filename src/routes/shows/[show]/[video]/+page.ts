import { redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import { dataStore } from '$lib/data'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params }) => {
	redirect(301, `${base}/videos/${params.show}/${params.video}`)
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
