import { getRequest, sleep } from './http.ts'

// Amount of items to fetch per request (max: 100)
const REQUEST_LIMIT = 100

// Gets data from the GiantBomb API
export default class GiantBomb {
	api_key: string
	delay: int // delay between requests to avoid hitting usage caps

	constructor(api_key: string, delay: int = 10) {
		this.api_key = api_key
		this.delay = delay
	}

	// Get all shows from the API
	async getShows(): Array {
		const url = 'https://giantbomb.com/api/public/shows'
		const params = {
			api_key: this.api_key,
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

			shows = shows.concat(results)
			page = page + 1
			await sleep(this.delay)
		}

		return shows
	}

	// Get all videos from the API
	async getVideos(): Array {
		const url = 'https://giantbomb.com/api/public/videos'
		const params = {
			api_key: this.api_key,
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

			videos = videos.concat(results)
			page = page + 1
			await sleep(this.delay)
		}

		return videos
	}
}
