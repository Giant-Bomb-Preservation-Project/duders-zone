<script lang="ts">
	import Button from '$lib/components/Button.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import { searchVideos } from '$lib/data'
	import type { Video } from '$lib/data'

	let videos: Video[]
	$: videos = []

	let searchQuery = ''

	//TODO debounce (trailing edge) this function
	const searchSubmit = () => {
		videos = searchQuery === '' ? [] : searchVideos(searchQuery)
	}
</script>

<div class="container">
	<h1>Search</h1>

	<form on:submit={searchSubmit}>
		<label for="search" class="sr-only">Search Query</label>
		<div id="field-wrapper">
			<input
				type="search"
				id="search"
				placeholder="search for something"
				bind:value={searchQuery}
			/>
		</div>
		<Button handler={() => {}}>Go Get It</Button>
	</form>

	{#if videos.length}
		<VideoList {videos} title="Videos" />
	{:else}
		<div class="empty">No videos...</div>
	{/if}
</div>

<style>
	form {
		align-items: center;
		display: flex;
		margin: 3em auto;
		max-width: 400px;
		width: 90%;
	}

	#field-wrapper {
		background-image: linear-gradient(#e8e8e8, #fff);
		border-radius: 4px;
		box-shadow: rgba(255, 255, 255, 0.25) 0 1px 0, rgba(0, 0, 0, 0.4) 0 1px 3px inset;
		flex: 1;
		height: 25px;
		margin-right: 1em;
	}

	input {
		background: url(/assets/icn_sprite2.png) no-repeat -8px -414px;
		border: 0;
		border-radius: 5px;
		color: black;
		display: block;
		height: 100%;
		padding: 0 0 0 16px;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
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
