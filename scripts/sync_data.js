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
const DELAY_TIME = 2

// Amount of shows to fetch per request (max: 100)
const SHOWS_PER_REQUEST = 100

// Amount of videos to fetch per request (max: 10000)
const VIDEOS_PER_REQUEST = 10000

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

///
/// Script functions
///

// Run the script
async function run() {
	if (!GB_API_KEY) {
		console.error('ERROR! Missing GB_API_KEY')
		process.exit(1)
	}

	console.log('TODO')
}

run()
