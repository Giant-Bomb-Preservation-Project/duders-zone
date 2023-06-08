import { error, redirect } from '@sveltejs/kit'
import { getVideosForDay } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const videos = getVideosForDay()
	if (videos.length === 0) throw error(404, 'Not found')

	const shuffled = videos.sort(() => 0.5 - Math.random())

	throw redirect(302, `/historic/${shuffled[0].id}`)
}) satisfies PageLoad
