import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	return { shows: dataStore.getShows() }
}) satisfies PageLoad
