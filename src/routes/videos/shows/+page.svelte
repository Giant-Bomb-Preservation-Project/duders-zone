<script lang="ts">
	import { base } from '$app/paths'
	import type { PageData } from './$types'
	import { IconType } from '$lib/components/Icon.svelte'
	import VideosHeader, { VideosPage } from '$lib/components/VideosHeader.svelte'
	import { ShowSorting } from '$lib/types'
	import Header from '$lib/components/Header.svelte'
	import ListButtons from '$lib/components/ListButtons.svelte'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	let sorting: ShowSorting = $state(ShowSorting.alphabetical)
	let sortedShows = $derived(getSortedShows(sorting))

	function getSortedShows(sort: ShowSorting) {
		if (sort === ShowSorting.mostVideos) {
			return [...data.shows].sort((a, b) => b.videos.length - a.videos.length)
		}
		return data.shows // Default sort is alphabetical
	}
</script>

<VideosHeader current={VideosPage.Shows} />
<section class="container shows">
	<Header title="Shows">
		<div class="controls">
			<ListButtons
				value={sorting}
				onChange={(option) => (sorting = option)}
				options={[
					{
						label: 'Alphabetical',
						icon: IconType.LeastFirst,
						option: ShowSorting.alphabetical,
					},
					{
						label: 'Most Videos',
						icon: IconType.MostFirst,
						option: ShowSorting.mostVideos,
					},
				]}
			/>
		</div>
	</Header>
	<ul>
		{#each sortedShows as show}
			<li>
				<a href={`${base}/videos/${show.id}`}>
					<img
						src={show.poster
							? `${base}/assets/shows/${show.poster}`
							: `${base}/assets/default.jpg`}
						alt=""
					/>
					<h2>{show.title}</h2>
					<p>{show.description}</p>
				</a>
			</li>
		{/each}
	</ul>
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
	h2 {
		font-size: 18px;
		line-height: 20px;
		margin: 0.5em 0 0.3em;
	}

	.controls {
		display: flex;
		align-items: center;
		margin-left: auto;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: var(--spacing) 0;
	}

	ul a {
		display: block;
		color: var(--color-text);
	}

	ul a:hover h2 {
		color: var(--color-red-active);
	}

	ul a p {
		color: var(--color-text-muted);
	}

	ul img {
		display: block;
		margin-bottom: 5px;
		width: 100%;
	}

	ul li {
		margin-bottom: 30px;
	}

	.shows {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	@media (min-width: 576px) {
		ul {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			column-gap: 10px;
		}
	}

	@media (min-width: 992px) {
		ul {
			grid-template-columns: repeat(3, 1fr);
			column-gap: var(--spacing);
		}

		ul li {
			margin-bottom: 50px;
		}
	}
</style>
