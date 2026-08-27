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

// Extract the ID from a YouTube URL
function extractYouTubeId(url: string): string {
	try {
		const urlObject = new URL(url)
		return urlObject.searchParams.get('v')
	} catch {
		return null // just swallow errors
	}
}

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
	let iaCollection = await readJSONFile(SOURCE_DIRECTORY_PATH + 'ia/collection.json')
	let gbShows = await readJSONFile(SOURCE_DIRECTORY_PATH + 'gb/shows.json')
	let gbVideos = await readJSONFile(SOURCE_DIRECTORY_PATH + 'gb/videos.json')
	let iaItems = []
	for (const identifier of iaCollection) {
		const itemFile = SOURCE_DIRECTORY_PATH + `ia/${identifier}.json`
		try {
			iaItems.push(await readJSONFile(itemFile))
		} catch (err) {
			// just continue, assuming the file doesn't exist
		}
	}

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
			deck: '',
			id: video.show.id,
			slug: video.show.slug,
			title: video.show.title,
		})
	}

	// Process all the shows, downloading their posters and logos
	for (const show of gbShows) {
		let poster = show.poster_image ? toFilename(show.poster_image.url) : null
		let logo = show.logo_image ? toFilename(show.logo_image.url) : null

		if (poster !== null) {
			try {
				await downloadFile(show.poster_image.url, SHOW_IMAGES_PATH + poster)
			} catch (err) {
				log.error(
					`Unable to download file (${err.response.status}): ${show.poster_image.url}`
				)
				poster = null
			}
		}

		if (logo !== null) {
			try {
				await downloadFile(show.logo_image.url, SHOW_IMAGES_PATH + logo)
			} catch (err) {
				log.error(
					`Unable to download file (${err.response.status}): ${show.logo_image.url}`
				)
				logo = null
			}
		}

		shows.push({
			id: show.slug ?? toIdentifier(show.title),
			gb_id: show.id,
			title: show.title,
			description: show.deck ?? '',
			poster,
			logo,
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

	let showsWithVideos = new Set()

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
		let gbVideoIndex = gbVideos.findIndex((item) => {
			return (
				item.publish_date.substring(0, 10) === (video.date || '').substring(0, 10) && // same date
				(item.show?.slug === videoShows[0] || // same show
					!item.show) && // no show
				(item.title.replace(/\s/g, '') === video.title.replace(/\s/g, '') || // same title
					(item.description || '').replace(/\s/g, '') ===
						(video.description || '').replace(/\s/g, '')) // same description
			)
		})

		if (gbVideoIndex !== -1) {
			if (gbVideos[gbVideoIndex].youtube_url) {
				const youtubeId = extractYouTubeId(gbVideos[gbVideoIndex].youtube_url)
				if (youtubeId) {
					source['youtube'] = youtubeId
				} else {
					log.warn(
						`Unable to extract YouTube ID from URL: ${gbVideos[gbVideoIndex].youtube_url}`
					)
				}
			}
			if (gbVideos[gbVideoIndex].thumbnail) {
				thumbnail = gbVideos[gbVideoIndex].thumbnail.url // default to the nicer GB thumbnail
			}

			gbVideos.splice(gbVideoIndex, 1) // so it doesn't get double added later
		} else {
			log.warn(`Missing GB video for IA video: ${video.title}`)
		}

		showsWithVideos.add(videoShows[0])

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

	for (let i = shows.length - 1; i >= 0; i--) {
		if (!showsWithVideos.has(shows[i].id)) {
			log.warn(`Removing ${shows[i].title} due to no videos`)
			shows.splice(i, 1)
		}
	}

	// Add the GB videos that don't have IA equivalents
	log.info(`Adding ${gbVideos.length} GB videos...`)
	log.warn('Skipping')
	for (const video of gbVideos) {
		continue
		if (!video.youtube_url) {
			log.debug(
				`Skipping GB video due to missing YouTube video: ${video.title} (${video.id})`
			)
			continue
		}

		const show = video.show?.id
			? shows.find((s) => s.gb_id == video.show.id).id
			: UNCATEGORIZED_SHOW_ID

		// Add the video to the video list
		videos.push({
			id: String(video.id),
			show,
			title: video.title,
			description: video.description,
			date: video.publish_date,
			thumbnail: video.thumbnail?.url,
			duration: null,
			hosts: [],
			source: {
				youtube: extractYouTubeId(video.youtube_url),
			},
		})
	}

	// Save the data

	// Sort the data so updates won't cause a lot of changes in Git
	shows.sort((a, b) => a.id - b.id)
	videos.sort((a, b) => a.id - b.id)

	await writeJSONFile(SHOWS_FILE_PATH, shows)
	log.success(`Saved ${shows.length} shows to: ${SHOWS_FILE_PATH}`)

	await writeJSONFile(VIDEOS_FILE_PATH, videos)
	log.success(`Saved ${videos.length} videos to: ${VIDEOS_FILE_PATH}`)
}

run()
