import { readJSONFile, writeJSONFile } from './utils/file.ts'
import { downloadFile } from './utils/http.ts'
import log from './utils/log.ts'

///
/// Config
///

const PEOPLE_FILE_PATH = 'src/lib/data/people.json'
const VIDEOS_FILE_PATH = 'src/lib/data/videos.json'

///
/// Script
///

async function run() {
	log.info('Reading source files...')
	let people = await readJSONFile(PEOPLE_FILE_PATH)
	let videos = await readJSONFile(VIDEOS_FILE_PATH)

	let peopleNames = people.map((person) => person.name)

	let missingPeople = {}
	for (const video of videos) {
		for (const host of video.hosts) {
			if (!peopleNames.includes(host)) {
				if (!(host in missingPeople)) {
					missingPeople[host] = 0
				}

				missingPeople[host] += 1
			}
		}
	}

	const orderedPeople = Object.keys(missingPeople)
		.sort()
		.reduce((obj, key) => {
			obj[key] = missingPeople[key]
			return obj
		}, {})

	log.info('Hosts with missing entries:')
	for (const [name, amount] of Object.entries(orderedPeople)) {
		log.info(`${name}: ${amount}`)
	}
}

run()
