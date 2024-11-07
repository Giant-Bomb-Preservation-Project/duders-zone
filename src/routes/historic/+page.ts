import { error, redirect } from '@sveltejs/kit'
import { dataStore } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (() => {
	const date = new Date()

	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')

	redirect(302, `/historic/${month}${day}`)
}) satisfies PageLoad
