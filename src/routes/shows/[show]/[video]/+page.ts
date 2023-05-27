import { error } from '@sveltejs/kit';
import { getShowById, getVideoById, getVideosForShow } from '$lib/data'
import type { PageLoad } from './$types';

export const load = (({ params }) => {
    const show = getShowById(params.show)

    if (show === null)
        throw error(404, 'Not found')

    const videos = getVideosForShow(params.show)

    const video = getVideoById(params.video)
    if (video === null)
        throw error(404, 'Not found')

    return { show, video, videos }
}) satisfies PageLoad

