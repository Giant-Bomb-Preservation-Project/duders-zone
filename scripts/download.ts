import { promises as fs } from 'fs'

import { checkExists, readJSONFile, writeJSONFile } from './utils/file.ts'
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

async function run(overwrite: boolean) {
	try {
		await fs.mkdir(TARGET_DIRECTORY_PATH + '/gb', { recursive: true })
		await fs.mkdir(TARGET_DIRECTORY_PATH + '/ia', { recursive: true })
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

	let targetFile = null

	targetFile = TARGET_DIRECTORY_PATH + 'ia/collection.json'
	if (overwrite || !(await checkExists(targetFile))) {
		log.info('Getting collection from Internet Archive...')
		let iaItems = await ia.getCollection(COLLECTION_IDENTIFIER)
		log.success(`Got ${iaItems.length} items`)
		await writeJSONFile(targetFile, iaItems)
		log.success(`Wrote file: ${targetFile}`)
	} else {
		log.warn('Skipping Internet Archive collection')
	}

	let iaCollection = await readJSONFile(targetFile)
	log.info(`Processing ${iaCollection.length} IA items...`)
	let skipped = 0
	let downloaded = 0
	let failed = 0
	for (const identifier of iaCollection) {
		targetFile = TARGET_DIRECTORY_PATH + `ia/${identifier}.json`
		if (overwrite || !(await checkExists(targetFile))) {
			try {
				let data = await ia.getMetadata(identifier)
				await writeJSONFile(targetFile, data)
				downloaded += 1
			} catch (e) {
				failed += 1
				log.error(`Error: ${e}`)
			}
		} else {
			skipped += 1
		}
	}
	log.success(`Downloaded ${downloaded} and skipped ${skipped} items`)
	if (failed !== 0) {
		log.error(` with ${failed} failures`)
	}

	targetFile = TARGET_DIRECTORY_PATH + 'gb/shows.json'
	if (overwrite || !(await checkExists(targetFile))) {
		log.info('Getting shows from Giant Bomb...')
		let gbShows = await gb.getShows()
		log.success(`Got ${gbShows.length} shows`)
		await writeJSONFile(targetFile, gbShows)
		log.success(`Wrote file: ${targetFile}`)
	} else {
		log.warn('Skipping Giant Bomb shows')
	}

	targetFile = TARGET_DIRECTORY_PATH + 'gb/videos.json'
	if (overwrite || !(await checkExists(targetFile))) {
		log.info('Getting videos from Giant Bomb...')
		let gbVideos = await gb.getVideos()
		log.success(`Got ${gbVideos.length} videos`)
		await writeJSONFile(targetFile, gbVideos)
		log.success(`Wrote file: ${targetFile}`)
	} else {
		log.warn('Skipping Giant Bomb videos')
	}
}

run(process.argv.includes('--overwrite'))
