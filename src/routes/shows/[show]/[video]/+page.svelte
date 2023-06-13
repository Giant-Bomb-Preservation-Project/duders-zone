<script lang="ts">
	import { page } from '$app/stores'
	import Pagination, { PAGE_SIZE } from '$lib/components/Pagination.svelte'
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: pageParam = $page.url.searchParams.get('page')
	$: pageNumber = pageParam ? parseInt(pageParam) : 1
	$: pageVideoIndexStart = (pageNumber - 1) * PAGE_SIZE
	$: pageVideos = data.videos.slice(pageVideoIndexStart, pageVideoIndexStart + PAGE_SIZE)
</script>

<h1 class="sr-only">{data.show.title}</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section class="container videos">
	<VideoList videos={pageVideos} title={data.show.title} rootUri="/shows/{data.show.id}" />
	<Pagination results={data.videos.length} current={pageNumber} />
</section>

<style>
	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}
</style>
