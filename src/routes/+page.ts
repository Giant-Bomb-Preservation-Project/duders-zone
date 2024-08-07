import { dataStore } from '$lib/data'
import type { Show, Video } from '$lib/data'
import type { PageLoad } from './$types'

function pickNRandomVideos(videos: Video[], n: number): Video[] {
	const shuffled = videos.sort(() => 0.5 - Math.random())
	return shuffled.slice(0, n)
}

interface ShowWithVideos extends Show {
	videoObjects: Video[]
}

export const load = (({ params }) => {
	const shows = dataStore.getRandomShows(3)
	const historicVideos = pickNRandomVideos(dataStore.getVideosForDay(), 4)

	const filledShows: ShowWithVideos[] = shows.map((show) => {
		return {
			...show,
			videoObjects: pickNRandomVideos(dataStore.getVideosForShow(show), 4),
		}
	})

	return {
		shows: filledShows,
		historicVideos,
	}
}) satisfies PageLoad
