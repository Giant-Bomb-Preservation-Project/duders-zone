import axios from 'axios'
import commandLineArgs from 'command-line-args'
import { promises as fs } from 'fs'
import path from 'path'

// Base URL to the Giant Bomb API
const BASE_URL = 'https://www.giantbomb.com/api/'

// Seconds to delay between making requests to GB
const DELAY_TIME = 2

// Amount of shows to fetch per page (max: 100)
const SHOWS_PER_PAGE = 100

// Path to the file to store the show meta data
const SHOWS_FILE = 'src/lib/data/shows.json'

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
		.replaceAll(' ', '-')
		.replace(/(.*\.\w+)(.*?)$/, '$1') // remove anything after the last period
}

// Get a list of all the shows
async function getShows() {
	const url = `${BASE_URL}video_shows/?api_key=${GB_API_KEY}&format=json&limit=${SHOWS_PER_PAGE}&offset=`
	const headers = { 'user-agent': 'Giant-Bomb-Preservation-Project/duders-zone' }

	var shows = []
	var page = 1
	while (true) {
		const full_url = url + (page - 1) * SHOWS_PER_PAGE

		var results = []
		try {
			console.debug(`Fetching from: ${full_url}`)
			const response = await axios.get(full_url)
			if (response.status !== 200) {
				console.error(`ERROR! Unexpected {response.status} response code`)
				console.error(response.data)
				return []
			}

			results = response.data.results ?? []
		} catch (error) {
			console.error(error)
			return []
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
			})
		}

		page = page + 1

		await sleep(DELAY_TIME)
	}

	return shows
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
	const optionDefinitions = [
		{ name: 'help', alias: 'h', type: Boolean, description: 'show this help text' },
		{ name: 'images', alias: 'i', type: Boolean, description: 'download show images' },
		{ name: 'shows', alias: 's', type: Boolean, description: 'download show data' },
	]
	const options = commandLineArgs(optionDefinitions)

	if (options.help) {
		console.log('Sync data with the Giant Bomb and Internet Archive APIs')
		console.log('')
		console.log('Usage:')
		console.log('  node sync_data.js [flags]')
		console.log('')
		console.log('Flags:')
		for (const opt of optionDefinitions) {
			console.log(`  -${opt.alias}, --${opt.name}\t${opt.description}`)
		}

		return
	}

	var shows = []
	if (options.shows || options.images) {
		console.log('Fetching show data...')

		shows = await getShows()

		if (options.shows) {
			console.log(`Got ${shows.length} shows!`)
			console.log(`Saving shows to: ${SHOWS_FILE}`)
			const formattedShows = shows.map((show) => {
				show.poster = getImageFilename(show.poster)
				show.logo = getImageFilename(show.logo)
				return show
			})
			await fs.writeFile(SHOWS_FILE, JSON.stringify(formattedShows, null, 4))
		}
	}

	if (options.images) {
		var images = {}
		for (const show of shows) {
			if (show.poster != null) {
				images[getImageFilename(show.poster)] = show.poster
			}
			if (show.logo != null) {
				images[getImageFilename(show.logo)] = show.logo
			}
		}

		console.log(`Downloading ${Object.values(images).length} images...`)
		for (const image of Object.keys(images)) {
			const target = IMAGES_PATH + image

			try {
				await fs.access(target, fs.constants.F_OK)
				console.debug(`Skipping ${image}`)
			} catch {
				await downloadFile(images[image], target)
				await sleep(DELAY_TIME)
			}
		}
	}
}

run()
