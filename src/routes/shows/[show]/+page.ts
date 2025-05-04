import { redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { EntryGenerator, PageLoad } from './$types'

export const load = (({ params }) => {
	redirect(301, `${base}/videos/${params.show}`)
}) satisfies PageLoad

export const entries: EntryGenerator = () => {
	return dataStore.getShows().map((show) => {
		return { show: show.id }
	})
}
