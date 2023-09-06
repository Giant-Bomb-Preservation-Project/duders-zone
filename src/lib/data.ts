import { error } from '@sveltejs/kit'
import showData from '$lib/data/shows.json'
import videoData from '$lib/data/videos.json'
import { extractWords } from '$lib/text'

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
		show: Object.values(shows).find((show) => show.videos.includes(video.id))?.id,
		thumbnail: video.thumbnail,
	}
}

const videoIndex: Map<string, string[]> = generateVideoIndex(videoData)

// Sort by date descending
const byDateDesc = (a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime()

// Sort randomly
const byRandom = () => 0.5 - Math.random()

// Sort by title ascending
const byTitleAsc = (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title)

export function generateVideoIndex(videoList: Video[]): { [key: string]: string[] } {
	const index = new Map();

	for (const video of videoList) {
		const words = extractWords(video.title);

		for (const word of words) {
			if (!index.has(word)) {
				index.set(word, [])
			}

			index.get(word).push(video.id)
		}
	}

	return index
}

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

export function searchVideos(searchQuery: string): Video[] {
	return getRandomVideos(4);
}
