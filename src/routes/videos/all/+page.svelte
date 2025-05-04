<script lang="ts">
	import { page } from '$app/stores'
	import VideoList from '$lib/components/VideoList.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
</script>

<section class="container videos">
	<VideoList videos={data.videos} title="All Videos" perPage={24} pageNumber={data.pageNumber} />
</section>

<svelte:head>
	<meta property="og:url" content="https://duders.zone/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Duders Zone" />
	<meta property="og:description" content="An archival website about video games." />
	<meta property="og:image" content="https://duders.zone/image.png" />
	<meta property="og:site_name" content="Duders Zone" />
	<title>Videos - Duders Zone</title>
	<meta name="description" content="An archival website about video games." />
</svelte:head>

<style>
	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}
</style>
