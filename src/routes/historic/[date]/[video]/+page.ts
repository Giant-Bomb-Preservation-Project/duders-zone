import { error } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import { parseDate } from '$lib/text'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const date = parseDate(params.date)
	if (!date) {
		throw error(400, `Unable to parse date: "${params.date}"`)
	}

	const video = dataStore.getVideoById(params.video)

	if (video === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForDay(date)

	return { date, video, videos }
}) satisfies PageLoad
