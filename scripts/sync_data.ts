import axios from 'axios'
import { promises as fs } from 'fs'
import path from 'path'

import { writeJSONFile } from './sources/file.ts'
import { downloadFile } from './sources/http.ts'
import GiantBomb from './sources/GiantBomb.ts'
import InternetArchive from './sources/InternetArchive.ts'

///
/// Config
///

// Identifier for the GB archive in Internet Archive
const COLLECTION_IDENTIFIER = 'giant-bomb-archive'

// Paths to the files to store the show and video meta data
const SHOWS_FILE_PATH = 'src/lib/data/shows.json'
const VIDEOS_FILE_PATH = 'src/lib/data/videos.json'

// Path to the location to store the show images
const SHOW_IMAGES_PATH = 'static/assets/shows/'

///
/// Helper functions
///

// Find a GB video in the list of IA videos
function findVideo(iaVideos: Array, gbVideo: Object, show: Object | null): Object {
	const guid = gbVideo.guid
	const title = gbVideo.name.trim()
	const description = gbVideo.description.trim()
	const date = gbVideo.publish_date.toISOString().substring(0, 10) // get just the date part

	const possibleVideos = show !== null ? show.videos : Object.keys(iaVideos)

	for (const identifier of possibleVideos) {
		const iaVideo = iaVideos[identifier]
		let score = 0

		score += iaVideo.title.includes(title) ? 1 : 0
		score += iaVideo.description && iaVideo.description.includes(description) ? 1 : 0
		score += iaVideo.id.includes(guid) ? 1 : 0
		score += iaVideo.date.toISOString().substring(0, 10) ? 1 : 0

		if (score >= 2) {
			// probably the right video
			return iaVideo
		}
	}

	return null
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

// Log text in a given color (defaulting to plain)
function log(color: string, text: string) {
	if (!text) {
		text = color
		color = 'none'
	}

	switch (color) {
	case 'gray':
		console.debug(`\x1b[37m${text}\x1b[0m`)
		break
	case 'success':
		console.log(`\x1b[32m${text}\x1b[0m`)
		break
	case 'warn':
		console.log(`\x1b[33m${text}\x1b[0m`)
		break
	case 'error':
		console.error(`\x1b[31m${text}\x1b[0m`)
		break
	default:
		console.log(text)
	}
}

///
/// Script
///

async function run() {
	if (!process.env.GB_API_KEY) {
		log('error', 'ERROR! Missing GB_API_KEY')
		process.exit(1)
	}

	const shows = {}
	const videos = {}

	// Load data

	const gb = new GiantBomb(process.env.GB_API_KEY)
	const ia = new InternetArchive()

	log('Getting items from Internet Archive...')
	let iaItems = await ia.getCollectionItems(COLLECTION_IDENTIFIER)
	log('success', `Got ${iaItems.length} items`)

	log('Getting shows from Giant Bomb...')
	let gbShows = await gb.getShows()
	log('success', `Got ${gbShows.length} shows`)

	log('Getting videos from Giant Bomb...')
	let gbVideos = await gb.getVideos()
	log('success', `Got ${gbVideos.length} videos`)

	// Process shows

	for (const video of gbVideos) {
		if (!video.show) {
			continue // nothing doing
		}

		const existingShow = gbShows.find((show) => show.id === video.show.id)
		if (existingShow) {
			continue // also nothing doing
		}

		// Show didn't come from the GB API so needs to be created
		gbShows.push({
			description: '',
			id: video.show.id,
			slug: video.show.slug,
			title: video.show.title,
			image: video.show.image,
			logo: video.show.logo,
		})
	}

	for (const show of gbShows) {
		const poster = toFilename(show.image)
		const logo = toFilename(show.logo)
		const identifier = show.slug ?? toIdentifier(show.title)

		if (poster !== null) {
			await downloadFile(show.image, SHOW_IMAGES_PATH + poster)
		}

		if (logo !== null) {
			await downloadFile(show.logo, SHOW_IMAGES_PATH + logo)
		}

		shows[identifier] = {
			id: identifier,
			gb_id: show.id,
			title: show.title,
			description: show.description ?? '',
			poster: poster,
			logo: logo,
			videos: [],
		}
	}

	// Process IA items

	for (const item of iaItems) {
		const identifier = item.identifier

		const video = {
			id: identifier,
			gb_id: null,
			show: null,
			title: item.title,
			description: item.description,
			date: item.date ? item.date : new Date(1970, 0, 1),
			thumbnail: `https://archive.org/services/img/${identifier}`,
			source: {
				internetarchive: identifier,
			},
		}

		for (const subject of item.subject) {
			const show = Object.values(shows).find((s) => s.title.toLowerCase() == subject.toLowerCase())
			var showId = toIdentifier(subject)
			if (show) {
				showId = show.id
			} else {
				log('gray', `Show not found in GB, creating: ${subject}`)
				shows[showId] = {
					id: showId,
					gb_id: null,
					title: subject,
					description: '',
					poster: null,
					logo: null,
					videos: [],
				}
			}

			shows[showId].videos.push(identifier)
			video.show = showId
		}

		videos[identifier] = video
	}

	// Process GB videos

	for (const item of gbVideos) {
		let show = null
		if (item.show?.id) {
			show = Object.values(shows).find((s) => s.gb_id == item.show.id)
			if (!show) {
				log('error', `Missing GB show with id: ${item.show.id}`)
			}
		}

		let video = findVideo(videos, item, show)
		if (video === null) {
			if (!show) {
				log('error', 
					`Skipping video missing from IA but also missing a show: ${item.name}`
				)
				continue // TODO: what to do?
			}

			if (!item.youtube_id) {
				log('error', 
					`Skipping video missing from IA but also missing a YouTube ID: ${item.name}`
				)
				continue // TODO: what to do?
			}

			if (!item.show) {
				log('error', `Skipping video missing a show: ${item.name}`)
				continue // TODO: what to do?
			}

			log('warn', `Video missing from IA, creating: ${item.name} (${item.id})`)
			const identifier = `UNARCHIVED-gb-${item.guid}` // so it sticks out
			video = {
				id: identifier,
				gb_id: item.id,
				show: show.id,
				title: item.name,
				description: item.description,
				date: item.publish_date,
				thumbnail: item.image,
				source: {
					youtube: item.youtube_id,
				},
			}
			videos[identifier] = video
			show.videos.push(identifier)
		}

		video.gb_id = item.id
		video.date = item.publish_date // usually more accurate
		if (item.youtube_id !== null) {
			video.source.youtube = item.youtube_id
		}

		if (item.image !== null) {
			video.thumbnail = item.image
		}
	}

	// Save the data

	const showsList = Object.values(shows)
	console.log(`Saving ${showsList.length} shows to: ${SHOWS_FILE_PATH}`)
	await writeJSONFile(SHOWS_FILE_PATH, showsList)

	const videosList = Object.values(videos)
	console.log(`Saving ${videosList.length} videos to: ${VIDEOS_FILE_PATH}`)
	await writeJSONFile(VIDEOS_FILE_PATH, videosList)
}

run()
