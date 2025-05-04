import { error, redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import { dataStore } from '$lib/data'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params }) => {
	const show = dataStore.getShowById(params.show)
	if (show === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForShow(show)
	if (videos.length === 0) throw error(404, 'Not found')

	redirect(302, `${base}/videos/${show.id}/${videos[0].id}`)
}) satisfies PageLoad

export const entries: EntryGenerator = () => {
	return dataStore.getShows().map((show) => {
		return { show: show.id }
	})
}
