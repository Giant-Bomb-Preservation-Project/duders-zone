import { error, redirect } from '@sveltejs/kit'
import { getShowById, getVideosForShow } from '$lib/data'
import type { PageLoad } from './$types'

export const load = (({ params }) => {
	const show = getShowById(params.show)

	if (show === null) throw error(404, 'Not found')

	const videos = getVideosForShow(show)
	if (videos.length === 0) throw error(404, 'Not found')

	const video = videos[0]

	throw redirect(302, `/shows/${show.id}/${video.id}`)
}) satisfies PageLoad
