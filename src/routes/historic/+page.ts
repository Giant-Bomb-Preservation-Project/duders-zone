import { error, redirect } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const videos = dataStore.getVideosForDay()
	if (videos.length === 0) throw error(404, 'Not found')

	const shuffled = videos.sort(() => 0.5 - Math.random())

	redirect(302, `/historic/${shuffled[0].id}`)
}) satisfies PageLoad
