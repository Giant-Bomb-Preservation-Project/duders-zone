import { promises as fs } from 'fs'

import { writeJSONFile } from './utils/file.ts'
import InternetArchive from './utils/InternetArchive.ts'
import GiantBomb from './utils/GiantBomb.ts'
import log from './utils/log.ts'

///
/// Config
///

// Identifier for the GB archive in Internet Archive
const COLLECTION_IDENTIFIER = 'giant-bomb-archive'

// Path to folder to save the files
const TARGET_DIRECTORY_PATH = 'tmp/'

///
/// Script
///

async function run() {
	try {
		await fs.mkdir(TARGET_DIRECTORY_PATH, { recursive: true })
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err
		}
	}

	if (!process.env.GB_API_KEY) {
		log.error('ERROR! Missing GB_API_KEY')
		process.exit(1)
	}

	const ia = new InternetArchive()
	const gb = new GiantBomb(process.env.GB_API_KEY, 1)

	log.info('Getting items from Internet Archive...')
	let iaItems = await ia.getCollectionItems(COLLECTION_IDENTIFIER)
	log.success(`Got ${iaItems.length} items`)
	var targetFile = TARGET_DIRECTORY_PATH + 'ia_items.json'
	await writeJSONFile(targetFile, iaItems)
	log.success(`Wrote file: ${targetFile}`)

	log.info('Getting shows from Giant Bomb...')
	let gbShows = await gb.getShows()
	log.success(`Got ${gbShows.length} shows`)
	targetFile = TARGET_DIRECTORY_PATH + 'gb_shows.json'
	await writeJSONFile(targetFile, gbShows)
	log.success(`Wrote file: ${targetFile}`)

	log.info('Getting videos from Giant Bomb...')
	let gbVideos = await gb.getVideos()
	log.success(`Got ${gbVideos.length} videos`)
	targetFile = TARGET_DIRECTORY_PATH + 'gb_videos.json'
	await writeJSONFile(targetFile, gbVideos)
	log.success(`Wrote file: ${targetFile}`)
}

run()
