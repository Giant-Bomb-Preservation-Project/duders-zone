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

// Seconds to delay between making requests
const SLEEP_DELAY = 5

// Seconds to delay between retrying failed requests
const RETRY_DELAY = 30

// Amount of times to retry a GET request
const REQUEST_ATTEMPTS = 3

// Amount of items to fetch per request to Giant Bomb (max: 100)
const GIANT_BOMB_REQUEST_LIMIT = 100

// Amount of videos to fetch per request to Internet Archive (max: 10000)
const INTERNET_ARCHIVE_REQUEST_LIMIT = 10000

// Paths to the files to store the show and video meta data
const SHOWS_FILE_PATH = 'src/lib/data/shows.json'
const VIDEOS_FILE_PATH = 'src/lib/data/videos.json'

// Path to the location to store the show images
const SHOW_IMAGES_PATH = 'static/shows/'

// Video types to skip
const UNWANTED_VIDEO_TYPES = ['Trailers', 'Trailers, Exclude From Infinite', 'Trailers, Features']

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
	let times = 0
	while (times < REQUEST_ATTEMPTS) {
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
				console.warn(
					`WARNING! Unexpected status code: ${e.response?.status}\n${e.response?.data}`
				)
			} else {
				throw e
			}
		}

		times += 1
		console.debug(`Retrying in ${RETRY_DELAY} seconds...`)
		await sleep(RETRY_DELAY)
	}

	fatalError('Unable to complete request')
}

// Read a JSON file
async function readJSONFile(path) {
	const contents = await fs.readFile(path, 'utf8')

	return JSON.parse(contents)
}

// Sleep function (thanks to: https://stackoverflow.com/a/39914235)
function sleep(seconds) {
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

	console.log(`Downloading show images...`)

	let skipped = 0
	for (const image of Object.keys(images)) {
		const target = SHOW_IMAGES_PATH + image

		try {
			await fs.access(target, fs.constants.F_OK)
			skipped += 1
		} catch {
			await downloadFile(images[image], target)
			await sleep(SLEEP_DELAY)
		}
	}

	console.debug(` -> ${Object.values(images).length - skipped} downloaded (${skipped} skipped)`)

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
				gb_id: null,
				show: 'unknown',
				title: item.title,
				description: item.description ?? '',
				date: new Date(item.date).toISOString(),
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

				video.show = showId
				shows[showId].videos.push(videoId)
			}

			videos.push(video)
		}

		if (Object.hasOwn(data, 'cursor')) {
			params.cursor = data.cursor
			await sleep(SLEEP_DELAY)
		} else if (found !== total) {
			fatalError(`Cursor not found in IA response: ${data}`)
		}
	}

	console.debug(` -> got ${videos.length} videos`)

	return videos
}

// Fetch videos from Giant Bomb
async function fetchGiantBombVideos(videos, shows) {
	console.log('Fetching Giant Bomb videos...')

	const url = 'https://www.giantbomb.com/api/videos/'
	const params = {
		api_key: GB_API_KEY,
		format: 'json',
		field_list: 'deck,id,image,name,publish_date,video_show,video_type,youtube_id',
		limit: GIANT_BOMB_REQUEST_LIMIT,
		offset: 0,
	}

	let page = 1
	let count = 0
	while (true) {
		params.offset = (page - 1) * GIANT_BOMB_REQUEST_LIMIT

		const data = await getRequest(url, params)

		const results = data.results ?? []
		if (results.length == 0) {
			break // we're done here
		}

		count += results.length

		for (const result of results) {
			if (UNWANTED_VIDEO_TYPES.includes(result.video_type)) {
				continue
			}

			let videoIndex = -1
			if (result.video_show?.id) {
				let show = Object.values(shows).find((show) => show.gb_id === result.video_show.id)

				// We didn't get the show from the /shows API call :/
				if (!show) {
					const showId = toIdentifier(result.video_show.title)
					if (Object.hasOwn(shows, showId)) {
						shows[showId].gb_id = result.video_show.id
						shows[showId].poster = result.video_show.image?.medium_url ?? null
						shows[showId].logo = result.video_show.logo?.medium_url ?? null
					} else {
						shows[showId] = {
							id: showId,
							gb_id: result.video_show.id,
							title: result.video_show.title,
							description: '',
							poster: result.video_show.image?.medium_url ?? null,
							logo: result.video_show.logo?.medium_url ?? null,
							videos: [],
						}
					}

					show = shows[showId]
				}

				videoIndex = videos.findIndex(
					(video) =>
						video.title === result.name.trim() && video.show === shows[show.id].id
				)
			} else {
				videoIndex = videos.findIndex((video) => video.title === result.name.trim())
			}

			if (videoIndex === -1) {
				console.warn(`WARNING! Can't find archive video for: ${result.name}`)
				continue
			}

			// Fill in only the fields we care about
			videos[videoIndex].gb_id = result.id
			videos[videoIndex].date = new Date(result.publish_date).toISOString() // the canonical date
			//videos[videoIndex].thumbnail = result.image?.medium_url ?? videos[videoIndex].thumbnail
			if (result.youtube_id) {
				videos[videoIndex].source.youtube = result.youtube_id
			}
		}

		page = page + 1
		await sleep(SLEEP_DELAY)
	}

	console.debug(` -> processed ${count} videos`)

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

		for (const result of results) {
			const identifier = toIdentifier(result.title)
			shows[identifier] = {
				id: identifier,
				gb_id: result.id,
				title: result.title,
				description: result.deck,
				poster: result.image?.medium_url ?? null,
				logo: result.logo?.medium_url ?? null,
				videos: [],
			}
		}

		page = page + 1
		await sleep(SLEEP_DELAY)
	}

	console.debug(` -> got ${Object.keys(shows).length} shows`)

	return shows
}

// Run the script
async function run() {
	if (!GB_API_KEY) {
		console.error('ERROR! Missing GB_API_KEY')
		process.exit(1)
	}

	let shows = await fetchShows()
	let videos = await fetchArchiveVideos(shows)
	videos = await fetchGiantBombVideos(videos, shows)

	shows = await downloadShowImages(shows)

	const showsList = Object.values(shows)
	console.log(`Saving ${showsList.length} shows to: ${SHOWS_FILE_PATH}`)
	await writeJSONFile(SHOWS_FILE_PATH, showsList)

	console.log(`Saving ${videos.length} shows to: ${VIDEOS_FILE_PATH}`)
	await writeJSONFile(VIDEOS_FILE_PATH, videos)
}

run()
