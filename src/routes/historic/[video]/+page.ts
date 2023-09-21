import { error } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const video = dataStore.getVideoById(params.video)

	if (video === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForDay()

	return { video, videos }
}) satisfies PageLoad
