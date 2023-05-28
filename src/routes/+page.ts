import { getRandomShows, getVideosForDay, getVideosForShow } from '$lib/data'
import type { Show, Video } from '$lib/data'
import type { PageLoad } from './$types';

function pickNRandomVideos(videos: Video[], n: number): Video[] {
    const shuffled = videos.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, n)
}

interface ShowWithVideos extends Show{
    videoObjects: Video[],
}

export const load = (({ params }) => {
    const shows = getRandomShows(3)
    const historicVideos = pickNRandomVideos(getVideosForDay(), 5)

    const filledShows: ShowWithVideos[] = shows.map(show => {
        return {
            ...show,
            videoObjects: pickNRandomVideos(getVideosForShow(show), 5)
        }
    })

    return {
        shows: filledShows,
        historicVideos,
    }
}) satisfies PageLoad
