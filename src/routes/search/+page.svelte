<script lang="ts">
	import VideoList from '$lib/components/VideoList.svelte'
	import { searchVideos } from '$lib/data'
	import type { Video } from '$lib/data'

	let videos: Video[]
	$: videos = []

	let searchQuery = ''

	const searchChanged = () => {
		videos = searchQuery === '' ? [] : searchVideos(searchQuery)
	}

</script>

<div class="container">
	<h1>Search</h1>

	<form>
		<label for="search" class="sr-only">Search Query</label>
		<input type="search" id="search" placeholder="Type search here..." bind:value={searchQuery} on:input={searchChanged}>
	</form>

	{#if videos.length }
		<VideoList {videos} title="Videos" />
	{:else}
		<div class="empty">No video results...</div>
	{/if}

</div>

<style>
	form {
		margin: 3em auto;
		max-width: 400px;
		width: 90%;
	}

	input {
		display: block;
		width: 100%;
	}

	.container {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	.empty {
		margin: 5em 0;
		text-align: center;
	}
</style>
