import { readJSONFile } from './utils/file.ts'
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
	const people: { name: string }[] = await readJSONFile(PEOPLE_FILE_PATH)
	const videos = await readJSONFile(VIDEOS_FILE_PATH)

	const peopleNames = people.map((person) => person.name)

	const missingPeople: Record<string, number> = {}
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
		.reduce<Record<string, number>>((obj, key) => {
			obj[key] = missingPeople[key]
			return obj
		}, {})

	log.info('Hosts with missing entries:')
	for (const [name, amount] of Object.entries(orderedPeople)) {
		log.info(`${name}: ${amount}`)
	}
}

run()
