<script lang="ts">
	import Button from '$lib/components/Button.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	const { searchQuery, videos } = $derived(data)
</script>

<div class="container">
	<h1 class="sr-only">Search</h1>

	<form method="GET">
		<label for="search">Search for Videos:</label>
		<div id="field-wrapper">
			<input type="search" id="search" name="q" value={searchQuery} />
		</div>
		<div id="button-wrapper">
			<Button>Go Get It</Button>
		</div>
	</form>

	{#if videos.length}
		<VideoList
			{videos}
			title={`Search results for: ${searchQuery}`}
			perPage={100}
			sortable={false}
		/>
	{:else if searchQuery}
		<div class="empty">No videos found for "{searchQuery}"</div>
	{:else}
		<div class="empty">You need to search for something...</div>
	{/if}
</div>

<svelte:head>
	<meta property="og:url" content="https://duders.zone/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Duders Zone" />
	<meta property="og:description" content="An archival website about video games." />
	<meta property="og:image" content="https://duders.zone/image.png" />
	<meta property="og:site_name" content="Duders Zone" />
	<title>Search - Duders Zone</title>
	<meta name="description" content="An archival website about video games." />
</svelte:head>

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

	label {
		display: block;
		font-family: var(--font-special);
		font-size: 18px;
		margin: 0.5em 0;
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
		color: var(--color-text-muted);
		font-size: 24px;
		font-style: italic;
		margin: 5em 0;
		text-align: center;
	}

	@media (min-width: 576px) {
	}

	@media (min-width: 768px) {
		form {
			display: none;
		}
	}
</style>
