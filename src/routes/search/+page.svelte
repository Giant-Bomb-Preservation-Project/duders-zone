<script lang="ts">
	import { page } from '$app/stores'
	import Button from '$lib/components/Button.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import { dataStore } from '$lib/data'
	import type { Video } from '$lib/data'

	let searchQuery: string | null = $derived($page.url.searchParams.get('q'))
	let videos: Video[] = $derived(searchQuery ? dataStore.searchVideos(searchQuery) : [])
</script>

<div class="container">
	<h1>Search</h1>

	<form method="GET">
		<label for="search" class="sr-only">Search Query</label>
		<div id="field-wrapper">
			<input
				type="search"
				id="search"
				placeholder="search for something"
				name="q"
				value={searchQuery}
			/>
		</div>
		<div id="button-wrapper">
			<Button>Go Get It</Button>
		</div>
	</form>

	{#if videos.length}
		<VideoList {videos} title="Videos" />
	{:else if searchQuery}
		<div class="empty">No videos found for "{searchQuery}"</div>
	{:else}
		<div class="empty">You need to search for something...</div>
	{/if}
</div>

<style>
	form {
		margin: 3em auto;
		max-width: 500px;
		width: 90%;
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

	#button-wrapper {
		text-align: center;
	}

	#field-wrapper {
		background-image: linear-gradient(#e8e8e8, #fff);
		border-radius: 4px;
		box-shadow:
			rgba(255, 255, 255, 0.25) 0 1px 0,
			rgba(0, 0, 0, 0.4) 0 1px 3px inset;
		flex: 1;
		height: 25px;
		margin-bottom: 2em;
	}

	.container {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	.empty {
		color: var(--color-gray-muted);
		font-size: 24px;
		font-style: italic;
		margin: 5em 0;
		text-align: center;
	}

	@media (min-width: 576px) {
		form {
			align-items: center;
			display: flex;
		}

		#field-wrapper {
			margin: 0 1em 0 0;
		}
	}
</style>
