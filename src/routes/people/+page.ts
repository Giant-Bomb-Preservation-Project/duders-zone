import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	return { people: dataStore.getPeople() }
}) satisfies PageLoad
