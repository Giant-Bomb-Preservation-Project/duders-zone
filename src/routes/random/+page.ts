import { error, redirect } from '@sveltejs/kit'
import { getRandomVideos } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const video = getRandomVideos(1)[0]

	throw redirect(302, `/random/${video.id}`)
}) satisfies PageLoad
