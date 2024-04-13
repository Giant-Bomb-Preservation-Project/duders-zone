import axios from 'axios'
import { promises as fs } from 'fs'
import path from 'path'

///
/// Config
///

// Headers sent with each request
const HEADERS = {
	'user-agent': 'Giant-Bomb-Preservation-Project/duders-zone',
}

// Identifier for the GB archive in Internet Archive
const COLLECTION_IDENTIFIER = 'giant-bomb-archive'

// Seconds to delay between making requests to GB
const DELAY_TIME = 5

// Amount of items to fetch per request to Giant Bomb (max: 100)
const GIANT_BOMB_REQUEST_LIMIT = 100

// Amount of videos to fetch per request to Internet Archive (max: 10000)
const INTERNET_ARCHIVE_REQUEST_LIMIT = 10000

// Paths to the files to store the show and video meta data
const SHOWS_FILE_PATH = 'src/lib/data/shows.json'
const VIDEOS_FILE_PATH = 'src/lib/data/videos.json'

// Path to the location to store the show images
const SHOW_IMAGES_PATH = 'static/shows/'

// The API key used when connecting to the Giant Bomb API
const GB_API_KEY = process.env.GB_API_KEY

///
/// Helper functions
///

// Download a file
async function downloadFile(source, target) {
	console.debug(`Downloading: ${source}`)
	const response = await axios.get(source, { responseType: 'arraybuffer' })
	const fileData = Buffer.from(response.data, 'binary')

	console.debug(` -> saving to ${target}`)
	await fs.writeFile(target, fileData)
}

// Show an error text and terminate the program
async function fatalError(message) {
	console.error(`ERROR! ${message}`)
	process.exit(1)
}

// Make a GET request to the given URL
async function getRequest(url, queryParams) {
	try {
		const queryString = Object.keys(queryParams)
			.map((k) => `${k}=${queryParams[k]}`)
			.join('&')
		console.debug(`GET ${url}?${queryString}`)
		const response = await axios.get(url, {
			headers: HEADERS,
			params: queryParams,
		})

		return response.data
	} catch (e) {
		if (e instanceof axios.AxiosError) {
			fatalError(`Unexpected status code: ${e.response.status}\n${e.response.data}`)
		} else {
			throw e
		}
	}
}

// Read a JSON file
async function readJSONFile(path) {
	const contents = await fs.readFile(path, 'utf8')

	return JSON.parse(contents)
}

// Sleep function (thanks to: https://stackoverflow.com/a/39914235)
function sleep(seconds) {
	console.debug(`Sleeping for ${seconds} seconds...`)

	return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

// Convert a URL to a filename
function toFilename(url) {
	if (url === null) {
		return null
	}

	return decodeURI(url)
		.split('/')
		.pop()
		.replace(/(.*\.\w+)(.*?)$/, '$1') // remove anything after the last period
}

// Convert text into a sanitized identifier
function toIdentifier(text) {
	return text
		.toLowerCase()
		.replaceAll(' ', '-')
		.replace(/[^\w-]/g, '')
}

// Write a JSON file
async function writeJSONFile(path, data) {
	await fs.writeFile(path, JSON.stringify(data, null, 4))
}

///
/// Script functions
///

async function downloadShowImages(shows) {
	let images = {}
	for (const [identifier, show] of Object.entries(shows)) {
		if (show.poster != null) {
			const filename = toFilename(show.poster)
			images[filename] = show.poster
			shows[identifier].poster = filename
		}

		if (show.logo != null) {
			const filename = toFilename(show.logo)
			images[filename] = show.logo
			shows[identifier].logo = filename
		}
	}

	console.log(`Downloading ${Object.values(images).length} images...`)
	for (const image of Object.keys(images)) {
		const target = SHOW_IMAGES_PATH + image

		try {
			await fs.access(target, fs.constants.F_OK)
			console.debug(`Skipping existing image: ${image}`)
		} catch {
			await downloadFile(images[image], target)
			await sleep(DELAY_TIME)
		}
	}

	return shows
}

// Get videos from Internet Archive
async function fetchArchiveVideos(shows) {
	console.log('Fetching Internet Archive videos...')

	const url = `https://archive.org/services/search/v1/scrape`
	const params = {
		q: `collection:${COLLECTION_IDENTIFIER}`,
		count: INTERNET_ARCHIVE_REQUEST_LIMIT,
		fields: 'identifier,date,title,description,mediatype,subject',
	}

	let total = -1
	let found = 0
	let videos = []
	while (found !== total) {
		let data = await getRequest(url, params)

		if (Object.hasOwn(data, 'error')) {
			fatalError(`Error returned from IA: ${data.error}`)
		}

		console.debug(` -> ${data.items.length} results`)

		if (total === -1) {
			total = data.total
		}
		found += data.count

		for (const item of data.items) {
			const videoId = item.identifier

			if (item.mediatype !== 'movies') {
				console.debug(`${videoId}: Skipping non-movie entry`)
				continue
			}

			const video = {
				id: videoId,
				//gb_id: null,
				//show: 'unknown',
				title: item.title,
				description: item.description ?? '',
				date: item.date,//(new Date(item.date)).toISOString(),
				thumbnail: `https://archive.org/services/img/${videoId}`,
				source: {
					internetarchive: videoId,
				},
			}

			const subjects =
				typeof item.subject === 'string' || item.subject instanceof String
					? [item.subject]
					: item.subject
			for (const subject of subjects) {
				if (subject === 'Giant Bomb') {
					continue
				}

				const showId = toIdentifier(subject)
				if (!Object.hasOwn(shows, showId)) {
					shows[showId] = {
						id: showId,
						title: subject,
						description: '',
						videos: [],
					}
				}

				//video.show = showId
				shows[showId].videos.push(videoId)
			}

			videos.push(video)
		}

		if (Object.hasOwn(data, 'cursor')) {
			params.cursor = data.cursor
		} else if (found !== total) {
			fatalError(`Cursor not found in IA response: ${data}`)
		}
	}

	return videos
}

// Fetch videos from Giant Bomb
async function fetchGiantBombVideos(shows) {
	console.log('Fetching Giant Bomb videos...')

	const url = 'https://www.giantbomb.com/api/videos/'
	const params = {
		api_key: GB_API_KEY,
		format: 'json',
		field_list: 'id,name,deck,video_show,publish_date,youtube_id,image',
		limit: GIANT_BOMB_REQUEST_LIMIT,
		offset: 0,
	}

	let videos = []
	let page = 1
	while (true) {
		params.offset = (page - 1) * GIANT_BOMB_REQUEST_LIMIT

		const data = await getRequest(url, params)

		const results = data.results ?? []
		if (results.length == 0) {
			break // we're done here
		}

		console.debug(` -> got ${results.length} results`)

		for (const result of results) {
			if (!Object.hasOwn(shows, result.video_show.id)) {
				fatalError(`Missing show with ID: ${result.video_show.id}`)
			}

			const video = {
				id: `gb-${result.id}`,
				gb_id: result.id,
				show: shows[result.video_show.id].id,
		        title: result.name,
		        description: result.deck,
		        date: (new Date(result.publish_date)).toISOString(),
		        thumbnail: result.image?.medium_url ?? null,
		        source: {},
			}
			if (result.youtube_id) {
				video.source.youtube = result.youtube_id
			}

			videos.push(video)
		}

		page = page + 1
		await sleep(DELAY_TIME)
	}

	return videos
}

// Get a list of all the shows from Giant Bomb
async function fetchShows() {
	console.log('Fetching shows...')

	const url = 'https://www.giantbomb.com/api/video_shows/'
	const params = {
		api_key: GB_API_KEY,
		format: 'json',
		field_list: 'id,title,deck,image,logo',
		limit: GIANT_BOMB_REQUEST_LIMIT,
		offset: 0,
	}

	let shows = {}
	let page = 1
	while (true) {
		params.offset = (page - 1) * GIANT_BOMB_REQUEST_LIMIT

		const data = await getRequest(url, params)
		const results = data.results ?? []
		if (results.length == 0) {
			break // we're done here
		}

		console.debug(` -> got ${results.length} results`)

		for (const result of results) {
			const identifier = toIdentifier(result.title)
			shows[identifier] = {
				id: identifier,
				//gb_id: result.id,
				title: result.title,
				description: result.deck,
				poster: result.image?.medium_url ?? null,
				logo: result.logo?.medium_url ?? null,
				videos: [],
			}
		}

		page = page + 1
		await sleep(DELAY_TIME)
	}

	return shows
}

// Run the script
async function run() {
	if (!GB_API_KEY) {
		console.error('ERROR! Missing GB_API_KEY')
		process.exit(1)
	}

	let shows = await fetchShows()
	shows = await downloadShowImages(shows)

	let videos = await fetchArchiveVideos(shows)

	//let videos = await fetchGiantBombVideos(shows)

	const showsList = Object.values(shows)
	console.log(`Saving ${showsList.length} shows to: ${SHOWS_FILE_PATH}`)
	await writeJSONFile(SHOWS_FILE_PATH, showsList)

	console.log(`Saving ${videos.length} shows to: ${VIDEOS_FILE_PATH}`)
	await writeJSONFile(VIDEOS_FILE_PATH, videos)
}

run()
