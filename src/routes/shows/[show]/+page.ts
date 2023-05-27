import { error, redirect } from '@sveltejs/kit';
import { getShowById, getVideosForShow } from '$lib/data'
import type { PageLoad } from './$types';

export const load = (({ params }) => {
    const show = getShowById(params.show)

    if (show === null)
        throw error(404, 'Not found')

    const video = getVideosForShow(params.show).shift()
    if (video === undefined)
        throw error(404, 'Not found')

    throw redirect(302, `/shows/${show.id}/${video.id}`)
}) satisfies PageLoad
