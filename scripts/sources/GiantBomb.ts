import { getRequest, sleep } from './http.ts'

// Amount of items to fetch per request (max: 100)
const REQUEST_LIMIT = 100

// Image size to fetch (icon_url, medium_url, screen_url, screen_large_url, small_url, super_url, thumb_url, tiny_url, original_url)
const IMAGE_SIZE = 'super_url'

export interface GiantBombShow {
	description: string
	id: number
	title: string
	image: string | null
	logo: string | null
}

export interface GiantBombVideo {
	description: string
	id: number
	name: string
	publish_date: Date
	image: string | null
	video_type: string
	show_id: int | null
	youtube_id: string | null
}

// Gets data from the GiantBomb API
export default class GiantBomb {
	api_key: string
	delay: int // delay between requests to avoid hitting usage caps

	constructor(api_key: string, delay: int = 10) {
		this.api_key = api_key
		this.delay = delay
	}

	// Get all shows from the API
	async getShows(): Array<GiantBombShow> {
		const url = 'https://www.giantbomb.com/api/video_shows/'
		const params = {
			api_key: this.api_key,
			format: 'json',
			field_list: 'id,title,deck,image,logo',
			limit: REQUEST_LIMIT,
			offset: 0,
		}

		let shows = []
		let page = 1
		while (true) {
			params.offset = (page - 1) * REQUEST_LIMIT

			const data = await getRequest(url, params)
			const results = data.results ?? []
			if (results.length == 0) {
				break // we're done here
			}

			for (const item of results) {
				shows.push({
					description: item.deck,
					id: item.id,
					title: item.title,
					image: item.image?.[IMAGE_SIZE] ?? null,
					logo: item.logo?.[IMAGE_SIZE] ?? null,
				} as GiantBombShow)
			}

			page = page + 1
			await sleep(this.delay)
		}

		return shows
	}

	// Get all videos from the API
	async getVideos(): Array<GiantBombVideo> {
		const url = 'https://www.giantbomb.com/api/videos/'
		const params = {
			api_key: this.api_key,
			format: 'json',
			field_list: 'deck,id,image,name,publish_date,video_show,video_type,youtube_id',
			limit: REQUEST_LIMIT,
			offset: 0,
		}

		let videos = []
		let page = 1
		while (true) {
			params.offset = (page - 1) * REQUEST_LIMIT

			const data = await getRequest(url, params)
			const results = data.results ?? []
			if (results.length == 0) {
				break // we're done here
			}

			for (const item of results) {

				videos.push({
					description: item.deck,
					id: item.id,
					name: item.name,
					publish_date: Date.parse(item.publish_date),
					image: item.image?.[IMAGE_SIZE] ?? null,
					video_type: item.video_type,
					show_id: item.video_show?.id ?? null,
					youtube_id: item.youtube_id,
				} as GiantBombVideo)
			}

			page = page + 1
			await sleep(this.delay)
		}

		return videos
	}
}
