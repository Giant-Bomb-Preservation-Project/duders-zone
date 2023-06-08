import { error } from '@sveltejs/kit'
import { getVideoById } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const video = getVideoById(params.video)

	if (video === null) throw error(404, 'Not found')

	return { video }
}) satisfies PageLoad
