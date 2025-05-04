import { redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { PageLoad } from './$types'

export const load = (() => {
	redirect(302, `${base}/videos/shows`)
}) satisfies PageLoad
