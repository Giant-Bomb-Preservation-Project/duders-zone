import { error } from '@sveltejs/kit'
import showData from '$lib/data/shows.json'
import videoData from '$lib/data/videos.json'
import { extractWords } from '$lib/text'

export enum VideoSource {
	InternetArchive = 'internetarchive',
	YouTube = 'youtube',
}

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
	readonly source: {
		readonly internetarchive?: string
		readonly youtube?: string
	}
}

// Sort by date descending
const byDateDesc = (a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime()

// Sort randomly
const byRandom = () => 0.5 - Math.random()

// Sort by title ascending
const byTitleAsc = (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title)

// Data store which contains the data for the app.
export class DataStore {
	readonly shows: { [key: string]: Show }
	readonly videos: { [key: string]: Video }
	readonly videoIndex: Map<string, string[]>

	// Construct the datastore based on given show and video data.
	constructor(showData: any[], videoData: any[]) {
		this.shows = {}
		for (const show of showData) {
			this.shows[show.id] = {
				id: show.id,
				title: show.title,
				description: show.description,
				poster: show.poster,
				logo: show.logo,
				videos: show.videos,
			}
		}

		this.videos = {}
		for (const video of videoData) {
			this.videos[video.id] = {
				id: video.id,
				title: video.title,
				description: video.description,
				date: new Date(video.date),
				show: Object.values(this.shows).find((show) => show.videos.includes(video.id))?.id,
				thumbnail: video.thumbnail,
				source: video.source,
			}
		}

		this.videoIndex = new Map()
		for (const video of videoData) {
			const words = extractWords(video.title)

			for (const word of words) {
				if (!this.videoIndex.has(word)) {
					this.videoIndex.set(word, [])
				}

				this.videoIndex.get(word)!.push(video.id)
			}
		}
	}

	// Get a random show.
	getRandomShows(amount: number): Show[] {
		const shuffled = Object.values(this.shows).sort(byRandom)

		return shuffled.slice(0, amount)
	}

	// Get a random video.
	getRandomVideos(amount: number): Video[] {
		const shuffled = Object.values(this.videos).sort(byRandom)

		return shuffled.slice(0, amount)
	}

	// Get a show by its ID.
	getShowById(id: string): Show | null {
		return id in this.shows ? this.shows[id] : null
	}

	// Get all shows (sorted alphabetically).
	getShows(): Show[] {
		return Object.values(this.shows).sort(byTitleAsc)
	}

	// Get a video by its ID.
	getVideoById(id: string): Video | null {
		return id in this.videos ? this.videos[id] : null
	}

	// Get all videos which were released on a given day.
	getVideosForDay(day?: Date): Video[] {
		day = day || new Date()

		const date = day.getDate()
		const month = day.getMonth()

		return Object.values(this.videos)
			.filter((video) => video.date.getDate() == date && video.date.getMonth() == month)
			.sort(byDateDesc)
	}

	// Get videos for a specific show.
	getVideosForShow(show: Show): Video[] {
		return show.videos.map((videoId) => this.videos[videoId]).sort(byDateDesc)
	}

	// Search videos for a given query.
	searchVideos(searchQuery: string, limit: number = 100): Video[] {
		const words = extractWords(searchQuery)

		const foundVideos = new Map()
		for (const word of words) {
			this.videoIndex.forEach((value, key) => {
				if (key.search(word) !== -1) {
					const matchWeight = word == key ? 10 : 5

					this.videoIndex.get(key)!.forEach((item) => {
						if (!foundVideos.has(item)) {
							foundVideos.set(item, 0)
						}
						foundVideos.set(item, foundVideos.get(item) + matchWeight)
					})
				}
			})
		}

		const sortedVideos = [...foundVideos].sort((a, b) => b[1] - a[1])
		const videoList = sortedVideos.map((item) => this.videos[item[0]]) as Video[]

		return videoList.slice(0, limit)
	}
}

export const dataStore = new DataStore(showData, videoData)
