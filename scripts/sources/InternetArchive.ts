import { getRequest, sleep } from './http.ts'

// Max items per request (min: 100)
const REQUEST_LIMIT = 10000

// Max retries
const MAX_RETRIES = 3

// Identifiers of movies in Internet Archive that we're not interested in
const UNWANTED_ITEMS = ['signup_confirmation']

// Internet Archive subjects to not consider as shows
const UNWANTED_SUBJECTS = ['Giant Bomb']

export interface ArchiveCollectionItem {
	identifier: string
	guid: string | null
	date: Date
	description: string
	subject: Array<string>
	title: string
	videoFile: string | null
	duration: number | null
}

// Gets data from the Internet Archive API
export default class InternetArchive {
	delay: int // delay between requests to avoid hitting usage caps

	constructor(delay: int = 1) {
		this.delay = delay
	}

	// Get all items from a collection based on its identifier
	async getCollectionItems(identifier: string): Array<ArchiveCollectionItem> {
		const scrapeUrl = 'https://archive.org/services/search/v1/scrape'
		const scrapeParams = {
			q: `collection:${identifier}`,
			count: REQUEST_LIMIT,
			fields: 'identifier,mediatype',
		}

		let total = -1
		let found = 0
		let identifiers = new Set()
		while (found !== total) {
			const data = await getRequest(scrapeUrl, scrapeParams)
			if ('error' in data) {
				throw new Error(`Error returned from IA: ${data.error}`)
			}

			if (total === -1) {
				total = data.total
			}
			found += data.count

			for (const item of data.items) {
				if (item.mediatype !== 'movies' || UNWANTED_ITEMS.includes(item.identifier)) {
					continue // we don't want it
				}

				identifiers.add(item.identifier)
			}

			if ('cursor' in data) {
				scrapeParams.cursor = data.cursor
				await sleep(this.delay)
			} else if (found !== total) {
				console.warn('Cursor not found in IA response', data)
				break
			}
		}

		const items = []
		for (const identifier of identifiers) {
			const metadataUrl = `https://archive.org/metadata/${identifier}`
			let data = {}
			let attempts = 0

			while (attempts < MAX_RETRIES) {
				data = await getRequest(metadataUrl)
				attempts += 1
				if ('metadata' in data) {
					break
				}
			}

			if ('error' in data) {
				throw new Error(`Error returned from IA: ${data.error}`)
			}

			const subject =
				typeof data.metadata.subject === 'string' || data.metadata.subject instanceof String
					? [data.metadata.subject]
					: data.metadata.subject

			let guid = null
			if ('external-identifier' in data.metadata) {
				const match = data.metadata['external-identifier']
					.toLowerCase()
					.match(/^gb-guid:(.+)$/)
				guid = match ? match[1] : null
			}

			const videoFile = data.files.find(
				(file) => file.source === 'original' && file.format === 'MPEG4'
			)

			var date = null
			if (data.metadata.date) {
				const match = data.metadata.date.match(/^(\d+)\/(\d+)\/(\d{4})$/)
				if (match) {
					date = new Date(parseInt(match[3], 10), parseInt(match[2], 10) - 1, parseInt(match[1]), 12)
				} else {
					date = new Date(data.metadata.date)
				}
			}

			items.push({
				identifier: data.metadata.identifier,
				guid,
				date,
				description: data.metadata.description,
				subject: subject.filter((s) => !UNWANTED_SUBJECTS.includes(s)),
				title: data.metadata.title,
				videoFile: videoFile
					? `https://archive.org/download/${data.metadata.identifier}/${videoFile.name}`
					: null,
				duration: videoFile?.length ?? null,
			} as ArchiveCollectionItem)
		}

		return items
	}
}
