import { error } from '@sveltejs/kit';
import showData from '$lib/data/shows.json'
import videoData from '$lib/data/videos.json'

export interface Show {
	id: string,
	title: string,
	description: string,
	logo?: string,
	poster?: string,
	videos: string[],
}

export interface Video {
	id: string,
	title: string,
	description: string,
	date: Date,
	show?: string,
	thumbnail?: string,
}

const shows: { [key:string]: Show } = {}
for (const show of showData) {
	shows[show.id] = show
}

const videos: { [key:string]: Video } = {}
for (const video of videoData) {
	videos[video.id] = {
		id: video.id,
		title: video.title,
		description: video.description,
		date: new Date(video.date),
		thumbnail: video.thumbnail,
	}
}

export function getRandomShows(amount: number): Show[] {
	const shuffled = Object.values(shows).sort(() => 0.5 - Math.random())

	return shuffled.slice(0, amount)
}

export function getRandomVideo(): Video {
	const shuffled = Object.values(videos).sort(() => 0.5 - Math.random())

	return shuffled[0]
}

export function getShowById(id: string): Show | null {
	return id in shows ? shows[id] : null
}

export function getShows(): Show[] {
	return Object.values(shows).sort((a, b) => a.title.localeCompare(b.title))
}

export function getVideoById(id: string): Video | null {
	return id in videos ? videos[id] : null
}

export function getVideosForDay(day?: Date): Video[] {
	day = day || new Date()

	const date = day.getDate()
	const month = day.getMonth()

	return Object.values(videos).filter(video => {
		return video.date.getDate() == date && video.date.getMonth() == month
	})
}

export function getVideosForShow(show: Show): Video[] {
	return show.videos
		.map(videoId => videos[videoId])
		.sort((a, b) => b.date.getTime() - a.date.getTime())
}
