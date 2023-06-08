import { getShows } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const shows = getShows()
	return { shows }
}) satisfies PageLoad

export const prerender = true
