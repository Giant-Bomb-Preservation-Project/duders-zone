import { error } from '@sveltejs/kit'
import peopleData from '$lib/data/people.json'
import showData from '$lib/data/shows.json'
import videoData from '$lib/data/videos.json'
import { extractWords } from '$lib/text'

export enum VideoSource {
	InternetArchive = 'internetarchive',
	Direct = 'direct',
	YouTube = 'youtube',
}

export interface Person {
	readonly id: string
	readonly name: string
	readonly image: string
	readonly links: readonly string[]
}

export interface InMemoriam {
	readonly id: string
	readonly name: string
	readonly years: string
	readonly image: string
}

export interface People {
	readonly alumni: Person[]
	readonly inMemoriam: InMemoriam[]
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
	readonly duration: string
	readonly source: {
		readonly internetarchive?: string
		readonly direct?: string
		readonly youtube?: string
	}
}

const SECONDS_PER_HOUR = 3600
const SECONDS_PER_MINUTE = 60
const SEARCH_WEIGHTS = {
	TITLE: 10,
	DESCRIPTION: 5,
	SHOW: 1,
}

// Sort by date descending
const byDateDesc = (a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime()

// Sort by name ascending
const byNameAsc = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)

// Sort randomly
const byRandom = () => 0.5 - Math.random()

// Sort by title ascending
const byTitleAsc = (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title)

// Format the duration, converting from seconds to hh:mm:ss
function formatDuration(duration: number | null): string {
	if (!duration) {
		return '--:--:--'
	}

	const hours = Math.floor(duration / SECONDS_PER_HOUR)
	const minutes = Math.floor((duration % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
	const seconds = duration % SECONDS_PER_MINUTE

	return (
		String(hours).padStart(2, '0') +
		':' +
		String(minutes).padStart(2, '0') +
		':' +
		String(seconds).padStart(2, '0')
	)
}

// Data store which contains the data for the app.
export class DataStore {
	readonly people: People
	readonly shows: { [key: string]: Show }
	readonly videos: { [key: string]: Video }
	readonly videoIndex: Map<string, Map<string, number>>

	// Construct the datastore based on given show and video data.
	constructor(peopleData: any, showData: any[], videoData: any[]) {
		let alumni = []
		for (const person of peopleData.alumni) {
			alumni.push({
				id: person.id,
				name: person.name,
				image: person.image,
				links: person.links,
			})
		}

		let inMemoriam = []
		for (const person of peopleData.in_memoriam) {
			inMemoriam.push({
				id: person.id,
				name: person.name,
				years: person.years,
				image: person.image,
			})
		}

		this.people = {
			alumni: alumni.sort(byNameAsc),
			inMemoriam: inMemoriam.sort(byNameAsc),
		}

		this.shows = {}
		for (const show of showData) {
			if (show.videos.length == 0) {
				continue
			}

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
				date: new Date(video.date ?? '2008-03-06T12:00Z'),
				show: video.show,
				thumbnail: video.thumbnail,
				duration: formatDuration(video.duration),
				source: video.source,
			}
		}

		this.videoIndex = new Map()
		// Helper function for adding some text to the index with the given video ID and weight
		const addWordToIndex = (text: string, videoId: string, weight: number) => {
			extractWords(text).map((word) => {
				if (!this.videoIndex.has(word)) {
					this.videoIndex.set(word, new Map())
				}

				if (this.videoIndex.get(word)!.has(videoId)) {
					return // use the previous weight
				}

				this.videoIndex.get(word)!.set(videoId, weight)
			})
		}

		for (const video of videoData) {
			addWordToIndex(video.title, video.id, SEARCH_WEIGHTS.TITLE)
			addWordToIndex(video.description, video.id, SEARCH_WEIGHTS.DESCRIPTION)
			addWordToIndex(this.shows[video.show].title, video.id, SEARCH_WEIGHTS.SHOW)
			addWordToIndex(this.shows[video.show].description, video.id, SEARCH_WEIGHTS.SHOW)
		}
	}

	// Return the people.
	getPeople(): People {
		// Return copies so the data source cannot be modified
		return {
			alumni: Array.from(this.people.alumni),
			inMemoriam: Array.from(this.people.inMemoriam),
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

	// Get a video by its Internet Archive ID.
	getVideoByIAId(id: string): Video | null {
		return Object.values(this.videos).find((v) => v.source.internetarchive == id) || null
	}

	// Get a video by its ID.
	getVideoById(id: string): Video | null {
		return id in this.videos ? this.videos[id] : null
	}

	// Get all videos sorted by date.
	getVideos(): Video[] {
		return Object.values(this.videos).sort(byDateDesc)
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
					const weightMultiplier = word == key ? 2 : 1 // exact matches are worth double

					this.videoIndex.get(key)!.forEach((weight, id) => {
						if (!foundVideos.has(id)) {
							foundVideos.set(id, 0)
						}

						foundVideos.set(id, foundVideos.get(id) + weight * weightMultiplier)
					})
				}
			})
		}

		const sortedVideos = [...foundVideos].sort((a, b) => b[1] - a[1])
		const videoList = sortedVideos.map((item) => this.videos[item[0]]) as Video[]

		return videoList.slice(0, limit)
	}
}

export const dataStore = new DataStore(peopleData, showData, videoData)
