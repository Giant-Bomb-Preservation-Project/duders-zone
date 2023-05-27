import { error } from '@sveltejs/kit';
import showData from '$lib/data/shows.json'
import videoData from '$lib/data/videos.json'

export interface Show {
	id: string,
	title: string,
	description: string,
	logo?: string,
	poster?: string,
}

export interface Video {
	id: string,
	title: string,
	description: string,
	date: Date,
	show?: string,
	image?: string,
}

const shows: Show[] = showData

const videos: Video[] = videoData.map(video => {
	return {
		id: video.id,
		title: video.title,
		description: video.description,
		date: new Date(video.date),
		show: video.show || undefined,
		image: video.image,
	}
})

export function getRandomVideo(): Video {
	const shuffled = videos.sort(() => 0.5 - Math.random())

	return shuffled[0]
}

export function getShowById(id: string): Show | null {
	for (const show of showData) {
		if (show.id === id) {
			return show
		}
	}

	return null
}

export function getShows(): Show[] {
	return showData
}

export function getVideoById(id: string): Video | null {
	for (const video of videos) {
		if (video.id === id) {
			return video
		}
	}

	return null
}

export function getVideosForDay(day?: Date): Video[] {
	if (day) {
		console.warn('[getVideosForDay] Passing in a date parameter is not yet supported')
	}

	return videos
}

export function getVideosForShow(show: string): Video[] {
	const showVideos: Video[] = []
	for (const video of videos) {
		if (video.show === show) {
			showVideos.push(video)
		}
	}

	return showVideos
}
