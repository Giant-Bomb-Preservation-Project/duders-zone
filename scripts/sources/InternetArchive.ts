import { getRequest, sleep } from './http.ts'

const REQUEST_LIMIT = 10000

export interface ArchiveCollectionItem {
	identifier: string
	mediatype: string
	date: Date
	description: string
	subject: Array<string>
	title: string
}

// Gets data from the Internet Archive API
export default class InternetArchive {
	delay: int // delay between requests to avoid hitting usage caps

	constructor(delay: int = 1) {
		this.delay = delay
	}

	// Get all items from a collection based on its identifier
	async getCollectionItems(identifier: string): Array<ArchiveCollectionItem> {
		const url = 'https://archive.org/services/search/v1/scrape'
		const params = {
			q: `collection:${identifier}`,
			count: REQUEST_LIMIT,
			fields: 'identifier,date,title,description,mediatype,subject',
		}

		let total = -1
		let found = 0
		let items = []
		while (found !== total) {
			let data = await getRequest(url, params)

			if (Object.hasOwn(data, 'error')) {
				throw new Error(`Error returned from IA: ${data.error}`)
			}

			if (total === -1) {
				total = data.total
			}
			found += data.count
			const results = data.items

			for (const item of results) {
				const subject =
					typeof item.subject === 'string' || item.subject instanceof String
						? [item.subject]
						: item.subject
				items.push({
					identifier: item.identifier,
					mediatype: item.mediatype,
					date: item.date ? new Date(item.date) : null,
					description: item.description,
					subject: subject,
					title: item.title,
				} as ArchiveCollectionItem)
			}

			if (Object.hasOwn(data, 'cursor')) {
				params.cursor = data.cursor
				await sleep(this.delay)
			} else if (found !== total) {
				console.warn('Cursor not found in IA response', data)
				break
			}
		}

		return items
	}
}
