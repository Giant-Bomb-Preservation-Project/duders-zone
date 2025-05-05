import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import { dataStore } from '$lib/data'
import { videoListSorting } from '$lib/store'
import { VideoListSorting } from '$lib/types'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params }) => {
	const show = dataStore.getShowById(params.show)
	if (show === null) throw error(404, 'Not found')

	const videos = dataStore.getVideosForShow(show)
	if (videos.length === 0) throw error(404, 'Not found')

	const video =
		get(videoListSorting) === VideoListSorting.NewestFirst
			? videos[0]
			: videos[videos.length - 1]

	redirect(302, `${base}/videos/${show.id}/${video.id}`)
}) satisfies PageLoad

export const entries: EntryGenerator = () => {
	return dataStore.getShows().map((show) => {
		return { show: show.id }
	})
}
