import axios from 'axios'
import { promises as fs } from 'fs'

// Base URL to the Giant Bomb API
const BASE_URL = 'https://www.giantbomb.com/api/'

// Seconds to delay between making requests to GB
const DELAY_TIME = 2

// Amount of shows to fetch per page (max: 100)
const SHOWS_PER_PAGE = 100

// Path to the file to store the show meta data
const TARGET_SHOWS_FILE = 'shows.json'

// Path to the location to store the images
const TARGET_IMAGES_PATH = './images'

// The API key used when connecting to the Giant Bomb API
const GB_API_KEY = process.env.GB_API_KEY

// Sleep function (thanks to: https://stackoverflow.com/a/39914235)
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// Convert a title into a show ID
function makeIdentifier(title) {
	return title
		.toLowerCase()
		.replaceAll(' ', '-')
		.replace(/[^\w-]/g, '')
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
			const response = await axios.get(full_url);
			if (response.status !== 200) {
	            console.error(`ERROR! Unexpected {response.status} response code`)
	            console.error(response.data)
	            return []
	        }

			results = response.data.results ?? [];
		} catch (error) {
			console.error(error);
			return []
		}

		console.debug(` -> ${results.length} results`)

		if (results.length == 0) {
			break  // nothing to do
		}

		for (const result of results) {
			shows.push({
                'id': makeIdentifier(result.title),
                'title': result.title,
                'description': result.deck,
                'poster': result.image ? result.image.medium_url : null,
                'logo': result.logo ? result.logo.medium_url : null,
            })
		}

        page = page + 1

        await sleep(DELAY_TIME)
	}

	return shows
}

// Run the script
async function run() {
	console.log('Fetching shows...')

	const shows = await getShows()
	console.log(`Got ${shows.length} shows!`)

	console.log(`Saving shows to: ${TARGET_SHOWS_FILE}`)
	await fs.writeFile(TARGET_SHOWS_FILE, JSON.stringify(shows, null, 4))
}

run()
