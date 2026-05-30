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
	log('Reading source files...')
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
			} catch(err) {
				if (err.response.status == 404) {
					log('error', `Unable to download file: ${show.image}`)
					poster = null
				} else {
					throw err
				}
			}
		}

		if (logo !== null) {
			try {
				await downloadFile(show.logo, SHOW_IMAGES_PATH + logo)
			} catch(err) {
				if (err.response.status == 404) {
					log('error', `Unable to download file: ${show.logo}`)
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
			videos: [],
		})
	}

	// Ensure all approrpiate IA subjects are added as shows
	for (const item of iaItems) {
		for (const subject of item.subject) {
			const show = shows.find((s) => s.title.toLowerCase() == subject.toLowerCase())
			if (!show) {
				log('gray', `Show not found in GB, creating: ${subject}`)
				shows.push({
					id: toIdentifier(subject),
					gb_id: null,
					title: subject,
					description: '',
					poster: null,
					logo: null,
					videos: [],
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
		videos: [],
	})

	// Process videos
	log(`Adding ${gbVideos.length} GB videos...`)
	for (const video of gbVideos) {
		const videoShows = new Set()

		if (video.show?.id) {
			// Add the associated show to the show list
			const show = shows.find((s) => s.gb_id == video.show.id)
			if (!show) {
				log('error', `Missing GB show with id: ${video.show.id}`)
				continue
			}

			videoShows.add(show.id)
		}

		// Find the IA video for this video using the GUID
		let iaVideoIndex = iaItems.findIndex((item) => item.guid === video.guid)

		if (iaVideoIndex === -1) {
			// Find the IA video for this video using metadata matching
			iaVideoIndex = iaItems.findIndex((item) => {
				let score = 0

				score += item.title.replaceAll(' ', '').includes(video.name.replaceAll(' ', ''))
					? 1
					: 0
				score +=
					item.description &&
					item.description
						.replaceAll(' ', '')
						.includes(video.description.replaceAll(' ', ''))
						? 1
						: 0
				score += item.identifier.includes(video.guid) ? 1 : 0
				if (item.date) {
					score +=
						item.date.substring(0, 10) == video.publish_date.substring(0, 10) ? 1 : 0
				}

				return score >= 2 // probably the right video
			})
		}

		const iaVideo = iaVideoIndex !== -1 ? iaItems[iaVideoIndex] : null
		if (iaVideo) {
			// Add the IA subjects to the show list
			for (const subject of iaVideo.subject) {
				const show = shows.find((s) => s.title.toLowerCase() == subject.toLowerCase())
				videoShows.add(show.id)
			}
		} else {
			if (!video.youtube_id) {
				log(
					'error',
					`Skipping video due to missing IA and YouTube video: ${video.name} (${video.id})`
				)
				continue // TODO: what to do?
			} else {
				log('warn', `Video is missing IA equivalent: ${video.name} (${video.id})`)
			}
		}

		// Video has no shows at all
		if (videoShows.size === 0) {
			videoShows.add(UNCATEGORIZED_SHOW_ID)
		}

		// Setup the video sources
		const source = {}
		if (video.youtube_id) {
			source['youtube'] = video.youtube_id
		}
		if (iaVideo) {
			source['internetarchive'] = iaVideo.identifier

			if (iaVideo.videoFile) {
				source['direct'] = iaVideo.videoFile
			}
		}

		// Add the video to the video list
		videos.push({
			id: video.guid,
			gb_id: video.id,
			show: videoShows.values().next().value,
			title: video.name,
			description: video.description,
			date: video.publish_date,
			thumbnail: video.image,
			duration: video.duration,
			source,
		})

		// Add the video to the show videos map
		for (const show of videoShows) {
			if (!(show in showVideos)) {
				showVideos[show] = []
			}

			showVideos[show].push(video.guid)
		}

		// Remove the video from the IA list (we don't need it anymore)
		if (iaVideoIndex != -1) {
			iaItems.splice(iaVideoIndex, 1)
		}
	}

	// Add the rest of the IA videos that don't have matching GB videos
	log(`Adding ${iaItems.length} IA videos...`)
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

		videos.push({
			id: video.identifier,
			gb_id: null,
			show: videoShows[0],
			title: video.title,
			description: video.description,
			date: video.date,
			thumbnail: `https://archive.org/services/img/${video.identifier}`,
			duration: video.duration ? parseInt(video.duration) : null,
			source,
		})

		for (const show of videoShows) {
			if (!(show in showVideos)) {
				showVideos[show] = []
			}

			showVideos[show].push(video.identifier)
		}
	}

	// Fill shows with videos
	for (const show of shows) {
		show.videos = showVideos[show.id] || []
	}

	// Save the data

	await writeJSONFile(SHOWS_FILE_PATH, shows)
	log('success', `Saved ${shows.length} shows to: ${SHOWS_FILE_PATH}`)

	await writeJSONFile(VIDEOS_FILE_PATH, videos)
	log('success', `Saved ${videos.length} videos to: ${VIDEOS_FILE_PATH}`)
}

run()
