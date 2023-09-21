import { error } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const show = dataStore.getShowById(params.show)

	if (show === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForShow(show)

	const video = dataStore.getVideoById(params.video)
	if (video === null) throw error(404, 'Not found')

	return { show, video, videos }
}) satisfies PageLoad
