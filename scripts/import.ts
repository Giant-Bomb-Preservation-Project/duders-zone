import { readJSONFile, writeJSONFile } from './utils/file.ts'
import { downloadFile } from './utils/http.ts'
import log from './utils/log.ts'

///
/// Config
///

// Path to folder where source files are
const SOURCE_DIRECTORY_PATH = 'tmp/'

// Paths to the files to store the show and video meta data
const SHOWS_FILE_PATH = 'src/lib/data/shows.json'
const VIDEOS_FILE_PATH = 'src/lib/data/videos.json'

// Path to the location to store the show images
const SHOW_IMAGES_PATH = 'static/assets/shows/'

// ID of the show which holds the uncategorized videos
const UNCATEGORIZED_SHOW_ID = 'uncategorized'

///
/// Helper functions
///

// Convert a URL to a filename
function toFilename(url: string): string {
	if (url === null) {
		return null
	}

	return decodeURI(url)
		.split('/')
		.pop()
		.replace(/(.*\.\w+)(.*?)$/, '$1') // remove anything after the last period
}

// Convert text into a sanitized identifier
function toIdentifier(text: string): string {
	return text
		.toLowerCase()
		.replaceAll(' ', '-')
		.replace(/[^\w-]/g, '')
}

///
/// Script
///

async function run() {
	log.info('Reading source files...')
	let iaItems = await readJSONFile(SOURCE_DIRECTORY_PATH + 'ia_items.json')
	let gbShows = await readJSONFile(SOURCE_DIRECTORY_PATH + 'gb_shows.json')
	let gbVideos = await readJSONFile(SOURCE_DIRECTORY_PATH + 'gb_videos.json')

	const shows = []
	const videos = []
	const showVideos = {}

	// Ensure all shows embedded under GB videos are accounted for
	for (const video of gbVideos) {
		if (!video.show) {
			continue // nothing doing
		}

		const existingShow = gbShows.find((show) => show.id === video.show.id)
		if (existingShow) {
			continue // also nothing doing
		}

		gbShows.push({
			description: '',
			id: video.show.id,
			slug: video.show.slug,
			title: video.show.title,
			image: video.show.image,
			logo: video.show.logo,
		})
	}

	// Process all the shows, downloading their posters and logos
	for (const show of gbShows) {
		let poster = toFilename(show.image)
		let logo = toFilename(show.logo)

		if (poster !== null) {
			try {
				await downloadFile(show.image, SHOW_IMAGES_PATH + poster)
			} catch (err) {
				if (err.response.status == 404) {
					log.error(`Unable to download file: ${show.image}`)
					poster = null
				} else {
					throw err
				}
			}
		}

		if (logo !== null) {
			try {
				await downloadFile(show.logo, SHOW_IMAGES_PATH + logo)
			} catch (err) {
				if (err.response.status == 404) {
					log.error(`Unable to download file: ${show.logo}`)
					logo = null
				} else {
					throw err
				}
			}
		}

		shows.push({
			id: show.slug ?? toIdentifier(show.title),
			gb_id: show.id,
			title: show.title,
			description: show.description ?? '',
			poster: poster,
			logo: logo,
		})
	}

	// Ensure all approrpiate IA subjects are added as shows
	for (const item of iaItems) {
		for (const subject of item.subject) {
			const show = shows.find((s) => s.title.toLowerCase() == subject.toLowerCase())
			if (!show) {
				log.debug(`Show not found in GB, creating: ${subject}`)
				shows.push({
					id: toIdentifier(subject),
					gb_id: null,
					title: subject,
					description: '',
					poster: null,
					logo: null,
				})
			}
		}
	}

	// Add a fake show to hold all the videos that don't have shows
	shows.push({
		id: UNCATEGORIZED_SHOW_ID,
		gb_id: null,
		title: 'Uncategorized',
		description: 'For all the videos that have no show of their own.',
		poster: null,
		logo: null,
	})

	// Process videos
	log.info(`Adding ${iaItems.length} IA videos...`)
	for (const video of iaItems) {
		const videoShows = []
		for (const subject of video.subject) {
			const show = shows.find((s) => s.title.toLowerCase() == subject.toLowerCase())
			videoShows.push(show.id)
		}

		if (videoShows.length === 0) {
			videoShows.push(UNCATEGORIZED_SHOW_ID)
		}

		const source = {
			internetarchive: video.identifier,
		}
		if (video.videoFile) {
			source['direct'] = video.videoFile
		}

		let thumbnail = `https://archive.org/services/img/${video.identifier}`
		let gbVideoIndex = gbVideos.findIndex((item) => item.guid === video.guid)
		if (gbVideoIndex !== -1) {
			if (gbVideos[gbVideoIndex].youtube_id) {
				source['youtube'] = gbVideos[gbVideoIndex].youtube_id
			}
			if (gbVideos[gbVideoIndex].image) {
				thumbnail = gbVideos[gbVideoIndex].image  // default to the nicer GB thumbnail
			}

			gbVideos.splice(gbVideoIndex, 1)  // so it doesn't get double added later
		}

		videos.push({
			id: video.identifier,
			gb_id: video.guid,
			show: videoShows[0],
			title: video.title,
			description: video.description,
			date: video.date,
			thumbnail,
			duration: video.duration ? parseInt(video.duration) : null,
			hosts: video.hosts,
			source,
		})
	}

	// Add the GB videos that don't have IA equivalents
	log.info(`Adding ${gbVideos.length} GB videos...`)
	for (const video of gbVideos) {
		if (!video.youtube_id) {
			log.error(`Skipping GB video due to missing YouTube video: ${video.name} (${video.id})`)
			continue
		}

		const show = video.show?.id
			? shows.find((s) => s.gb_id == video.show.id).id
			: UNCATEGORIZED_SHOW_ID

		// Add the video to the video list
		videos.push({
			id: video.guid,
			gb_id: video.id,
			show,
			title: video.name,
			description: video.description,
			date: video.publish_date,
			thumbnail: video.image,
			duration: video.duration,
			hosts: [],
			source: {
				youtube: video.youtube_id,
			},
		})
	}

	// Save the data

	await writeJSONFile(SHOWS_FILE_PATH, shows)
	log.success(`Saved ${shows.length} shows to: ${SHOWS_FILE_PATH}`)

	await writeJSONFile(VIDEOS_FILE_PATH, videos)
	log.success(`Saved ${videos.length} videos to: ${VIDEOS_FILE_PATH}`)
}

run()
