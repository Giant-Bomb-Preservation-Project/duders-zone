import { error } from '@sveltejs/kit'
import showData from '$lib/data/shows.json'
import videoData from '$lib/data/videos.json'

export interface Show {
	readonly id: string
	readonly title: string
	readonly description: string
	readonly logo?: string | null
	readonly poster?: string
	readonly videos: readonly string[]
}

export interface Video {
	readonly id: string
	readonly title: string
	readonly description: string
	readonly date: Date
	readonly show?: string
	readonly thumbnail?: string
}

const shows: { [key: string]: Show } = {}
for (const show of showData) {
	shows[show.id] = show
}

const videos: { [key: string]: Video } = {}
for (const video of videoData) {
	videos[video.id] = {
		id: video.id,
		title: video.title,
		description: video.description,
		date: new Date(video.date),
		thumbnail: video.thumbnail,
	}
}

// Sort by date descending
const byDateDesc = (a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime()

// Sort randomly
const byRandom = () => 0.5 - Math.random()

// Sort by title ascending
const byTitleAsc = (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title)

export function getRandomShows(amount: number): Show[] {
	const shuffled = Object.values(shows).sort(byRandom)

	return shuffled.slice(0, amount)
}

export function getRandomVideos(amount: number): Video[] {
	const shuffled = Object.values(videos).sort(byRandom)

	return shuffled.slice(0, amount)
}

export function getShowById(id: string): Show | null {
	return id in shows ? shows[id] : null
}

export function getShows(): Show[] {
	return Object.values(shows).sort(byTitleAsc)
}

export function getVideoById(id: string): Video | null {
	return id in videos ? videos[id] : null
}

export function getVideosForDay(day?: Date): Video[] {
	day = day || new Date()

	const date = day.getDate()
	const month = day.getMonth()

	return Object.values(videos)
		.filter((video) => video.date.getDate() == date && video.date.getMonth() == month)
		.sort(byDateDesc)
}

export function getVideosForShow(show: Show): Video[] {
	return show.videos.map((videoId) => videos[videoId]).sort(byDateDesc)
}
