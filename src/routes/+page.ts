import { getVideosForDay, getVideosForShow } from '$lib/data'
import type { Video } from '$lib/data'
import type { PageLoad } from './$types';

function pickNRandomVideos(videos: Video[], n: number): Video[] {
    const shuffled = videos.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, n)
}

export const load = (({ params }) => {
    const quickLookVideos = pickNRandomVideos(getVideosForShow('quick-looks'), 5)
    const historicVideos = pickNRandomVideos(getVideosForDay(), 5)

    return {
        quickLookVideos,
        historicVideos,
    }
}) satisfies PageLoad
