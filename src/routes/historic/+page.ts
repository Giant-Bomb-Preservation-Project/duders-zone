import { error, redirect } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import { dateToText } from '$lib/text'
import type { PageLoad } from './$types'

export const load = (() => {
	const date = new Date()

	redirect(302, '/historic/' + dateToText(date))
}) satisfies PageLoad
