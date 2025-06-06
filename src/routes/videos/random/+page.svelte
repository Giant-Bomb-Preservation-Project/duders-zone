<script lang="ts">
	import { onMount } from 'svelte'
	import { onNavigate } from '$app/navigation'
	import { base } from '$app/paths'
	import Button from '$lib/components/Button.svelte'
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte'
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import { dataStore, type Video } from '$lib/data'
	import VideoList from '$lib/components/VideoList.svelte'
	import VideosHeader, { VideosPage } from '$lib/components/VideosHeader.svelte'
	import type { OnNavigate } from '@sveltejs/kit'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	let loading: boolean = $state(false)
	let videos: Video[] = $state([])

	onMount(() => {
		randomize()
	})

	onNavigate((navigation: OnNavigate) => {
		if (navigation.to?.route.id === `${base}/videos/random`) randomize()
	})

	const randomize = () => {
		if (loading) return // don't double up
		loading = true

		setTimeout(() => {
			videos = dataStore.getRandomVideos(12)
			loading = false
		})
	}
</script>

<VideosHeader current={VideosPage.Random} />

<h1 class="sr-only">Random</h1>

<section id="video-container" class="container videos">
	{#if loading || videos.length == 0}
		<LoadingIndicator />
	{:else}
		<VideoList {videos} title="Random Videos" sortable={false} />
	{/if}

	<div class="controls">
		<Button handler={randomize}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"
				><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
					d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"
				/></svg
			>
			Randomize
		</Button>
	</div>
</section>

<svelte:head>
	<meta property="og:url" content="https://duders.zone/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Duders Zone" />
	<meta property="og:description" content="An archival website about video games." />
	<meta property="og:image" content="https://duders.zone/image.png" />
	<meta property="og:site_name" content="Duders Zone" />
	<title>Random Videos - Duders Zone</title>
	<meta name="description" content="An archival website about video games." />
</svelte:head>

<style>
	.controls {
		margin: var(--spacing) 0;
		text-align: center;
	}
	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}
</style>
