import { dataStore } from '$lib/data'
import type { Show, Video } from '$lib/data'
import type { PageLoad } from './$types'

function pickNRandomVideos(videos: Video[], n: number): Video[] {
	const shuffled = videos.sort(() => 0.5 - Math.random())
	return shuffled.slice(0, n)
}

export const load = (({ params }) => {
	const shows = dataStore.getRandomShows(3)
	const historicVideos = pickNRandomVideos(dataStore.getVideosForDay(), 6)
	const videos = dataStore.getRandomVideos(4)

	return {
		shows,
		historicVideos,
		videos,
	}
}) satisfies PageLoad
