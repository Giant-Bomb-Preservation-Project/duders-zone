import { error, redirect } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import { allDates } from '$lib/dates'
import { dateToText, textToDate } from '$lib/text'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params }) => {
	const date = textToDate(params.date)
	if (!date) {
		throw error(400, `Unable to parse date: "${params.date}"`)
	}

	const videos = dataStore.getVideosForDay(date)
	if (videos.length === 0) throw error(404, 'Not found')

	const shuffled = videos.sort(() => 0.5 - Math.random())

	redirect(302, `/historic/${params.date}/${shuffled[0].id}`)
}) satisfies PageLoad

export const entries: EntryGenerator = () => {
	return allDates().map((date) => {
		return { date: dateToText(date) }
	})
}
