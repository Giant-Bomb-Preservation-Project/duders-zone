import { redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { PageLoad } from './$types'

export const load = (() => {
	redirect(301, `${base}/videos/random`)
}) satisfies PageLoad
