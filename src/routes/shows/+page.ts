import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const shows = dataStore.getShows()
	return { shows }
}) satisfies PageLoad
