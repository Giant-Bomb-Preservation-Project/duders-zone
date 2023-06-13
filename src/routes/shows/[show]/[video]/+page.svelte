<script lang="ts">
	import { page } from '$app/stores'
	import Pagination, { paginate } from '$lib/components/Pagination.svelte'
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: pageParam = $page.url.searchParams.get('page')
	$: paginatedVideos = paginate(pageParam, data.videos)
</script>

<h1 class="sr-only">{data.show.title}</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section class="container videos">
	<VideoList
		videos={paginatedVideos.items}
		title={data.show.title}
		rootUri="/shows/{data.show.id}"
	/>
	<Pagination totalResults={data.videos.length} currentPage={paginatedVideos.number} />
</section>

<style>
	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}
</style>
