<script lang="ts">
	import { page } from '$app/stores'
	import Pagination, { paginate } from '$lib/components/Pagination.svelte'
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	let pageParam = $derived($page.url.searchParams.get('page'))
	let pageNumber = $derived(pageParam ? parseInt(pageParam) : 1)
	let paginatedVideos = $derived(paginate(pageNumber, data.videos))
</script>

<h1 class="sr-only">{data.show.title}</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section class="container videos">
	<VideoList
		videos={paginatedVideos}
		title={data.show.title}
		linkSuffix={`?page=${pageNumber}`}
	/>
	<Pagination totalResults={data.videos.length} currentPage={pageNumber} />
</section>

<style>
	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}
</style>
