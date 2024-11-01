import { error } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const video = dataStore.getVideoById(params.video)
	const videos = dataStore.getRandomVideos(12)

	if (video === null) throw error(404, 'Not found')

	return { video, videos }
}) satisfies PageLoad
