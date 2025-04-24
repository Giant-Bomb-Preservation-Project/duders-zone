import { error } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import { allDates } from '$lib/dates'
import { dateToText, textToDate } from '$lib/text'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params }) => {
	const date = textToDate(params.date)
	if (!date) {
		throw error(400, `Unable to parse date: "${params.date}"`)
	}

	const video = dataStore.getVideoById(params.video)

	if (video === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForDay(date)

	return { date, video, videos }
}) satisfies PageLoad

export const entries: EntryGenerator = () => {
	var results: { date: string; video: string }[] = []

	for (const date of allDates()) {
		const videos = dataStore.getVideosForDay(date).map((video) => {
			return { date: dateToText(date), video: video.id }
		})

		results = results.concat(videos)
	}

	return results
}
