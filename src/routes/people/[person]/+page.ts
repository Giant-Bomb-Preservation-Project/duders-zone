import { error, redirect } from '@sveltejs/kit'
import { browser } from '$app/environment'
import { base } from '$app/paths'
import { dataStore } from '$lib/data'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params, url }) => {
	const person = dataStore.getPersonById(params.person)
	if (person === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForPerson(person)

	const pageNumber: number | null =
		browser && url.searchParams.get('page')
			? parseInt(url.searchParams.get('page') ?? '1') || 1
			: null

	return { person, videos, pageNumber }
}) satisfies PageLoad
