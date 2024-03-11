import axios from 'axios'
import { promises as fs } from 'fs'
import path from 'path'

// Headers sent with each request
const HEADERS = {
	'user-agent': 'Giant-Bomb-Preservation-Project/duders-zone',
}

// Identifier for the GB archive
const COLLECTION_IDENTIFIER = 'giant-bomb-archive'

// Seconds to delay between making requests to GB
const DELAY_TIME = 2

// Amount of shows to fetch per request (max: 100)
const SHOWS_PER_REQUEST = 100

// Amount of videos to fetch per request (max: 10000)
const VIDEOS_PER_REQUEST = 10000

// Paths to the files to store the show and video meta data
const SHOWS_FILE = 'src/lib/data/shows.json'
const VIDEOS_FILE = 'src/lib/data/videos.json'

// Path to the location to store the images
const IMAGES_PATH = 'static/shows/'

// The API key used when connecting to the Giant Bomb API
const GB_API_KEY = process.env.GB_API_KEY

// Sleep function (thanks to: https://stackoverflow.com/a/39914235)
function sleep(seconds) {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

// Convert a title into a show ID
function makeIdentifier(title) {
	return title
		.toLowerCase()
		.replaceAll(' ', '-')
		.replace(/[^\w-]/g, '')
}

// Convert a URL to an image filename
function getImageFilename(url) {
	if (url === null) {
		return null
	}

	return decodeURI(url)
		.split('/')
		.pop()
		.replace(/(.*\.\w+)(.*?)$/, '$1') // remove anything after the last period
}

// Get a list of all the shows
async function getShows() {
	const url = `https://www.giantbomb.com/api/video_shows/?api_key=${GB_API_KEY}&format=json&limit=${SHOWS_PER_REQUEST}&offset=`

	let shows = []
	let page = 1
	while (true) {
		const full_url = url + (page - 1) * SHOWS_PER_REQUEST

		let results = []
		try {
			console.debug(`Fetching from: ${full_url}`)
			const response = await axios.get(full_url, { headers: HEADERS })
			results = response.data.results ?? []
		} catch (error) {
			console.error(error)
			process.exit(1)
		}

		console.debug(` -> ${results.length} results`)

		if (results.length == 0) {
			break // nothing to do
		}

		for (const result of results) {
			shows.push({
				id: makeIdentifier(result.title),
				title: result.title,
				description: result.deck,
				poster: result.image ? result.image.medium_url : null,
				logo: result.logo ? result.logo.medium_url : null,
				videos: [],
			})
		}

		page = page + 1

		await sleep(DELAY_TIME)
	}

	return shows
}

// Get videos from Internet Archive
async function getVideos(showMap) {
	const url = `https://archive.org/services/search/v1/scrape`
	const params = {
		q: `collection:${COLLECTION_IDENTIFIER}`,
		count: VIDEOS_PER_REQUEST,
		fields: 'identifier,date,title,description,mediatype,subject',
	}

	let videos = []
	let total = -1
	let found = 0

	while (found !== total) {
		let data = {}
		try {
			console.debug(`Fetching from: ${url}`)
			const response = await axios.get(url, {
				headers: HEADERS,
				params: params,
			})
			data = response.data
		} catch (e) {
			if (e instanceof axios.AxiosError) {
				console.error(`ERROR! Unexpected status code: ${e.response.status}`)
				console.error(e.response.data)
				process.exit(1)
			} else {
				throw e
			}
		}

		console.debug(` -> ${data.items.length} results`)

		if (Object.hasOwn(data, 'error')) {
			console.error(`ERROR! Error returned from IA: ${data.error}`)
			process.exit(1)
		}

		if (total === -1) {
			total = data.total
		}
		found += data.count

		for (const item of data.items) {
			const videoId = item.identifier

			if (item.mediatype !== 'movies') {
				console.log(`${videoId}: Skipping non-movie entry`)
				continue
			}

			const video = {
				id: videoId,
				title: item.title,
				description: item.description ?? '',
				date: item.date,
				thumbnail: `https://archive.org/services/img/${videoId}`,
			}

			const subjects =
				typeof item.subject === 'string' || item.subject instanceof String
					? [item.subject]
					: item.subject
			for (const subject of subjects) {
				if (subject === 'Giant Bomb') {
					continue
				}

				const showId = makeIdentifier(subject)
				if (!Object.hasOwn(showMap, showId)) {
					showMap[showId] = {
						id: showId,
						title: subject,
						description: '',
						videos: [],
					}
				}

				showMap[showId].videos.push(videoId)
			}

			videos.push(video)
		}

		if (Object.hasOwn(data, 'cursor')) {
			params.cursor = data.cursor
		} else if (found !== total) {
			console.error(`ERROR! Cursor not found in IA response`)
			console.error(data)
			process.exit(1)
		}
	}

	return videos
}

// Download an image file
async function downloadFile(source, target) {
	console.debug(`Downloading: ${source}`)
	const response = await axios.get(source, { responseType: 'arraybuffer' })
	const fileData = Buffer.from(response.data, 'binary')

	console.debug(` -> saving to ${target}`)
	await fs.writeFile(target, fileData)
}

// Run the script
async function run() {
	if (!GB_API_KEY) {
		console.error('ERROR! Missing GB_API_KEY')
		process.exit(1)
	}

	console.log('Fetching show data...')
	let shows = await getShows()

	let images = {}
	shows = shows.map((show) => {
		if (show.poster != null) {
			images[getImageFilename(show.poster)] = show.poster
			show.poster = getImageFilename(show.poster)
		}

		if (show.logo != null) {
			images[getImageFilename(show.logo)] = show.logo
			show.logo = getImageFilename(show.logo)
		}
		return show
	})

	console.log(`Downloading ${Object.values(images).length} images...`)
	for (const image of Object.keys(images)) {
		const target = IMAGES_PATH + image

		try {
			await fs.access(target, fs.constants.F_OK)
			console.debug(`Skipping existing image: ${image}`)
		} catch {
			await downloadFile(images[image], target)
			await sleep(DELAY_TIME)
		}
	}

	console.log('Fetching videos...')
	const showMap = Object.fromEntries(shows.map((show) => [show.id, show]))
	const videos = await getVideos(showMap)
	shows = Object.values(showMap)  // catch shows that were added via videos

	console.log(`Saving ${videos.length} videos to: ${VIDEOS_FILE}`)
	await fs.writeFile(VIDEOS_FILE, JSON.stringify(videos, null, 4))

	console.log(`Saving ${shows.length} shows to: ${SHOWS_FILE}`)
	await fs.writeFile(SHOWS_FILE, JSON.stringify(shows, null, 4))
}

run()
