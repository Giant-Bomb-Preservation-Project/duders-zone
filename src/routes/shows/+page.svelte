<script lang="ts">
	import type { PageData } from './$types'
	import { ShowSorting } from '$lib/types'

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

<h1 class="sr-only">Shows</h1>

<section class="container shows">
	<select bind:value={sorting}>
		<option value={ShowSorting.alphabetical}>Alphabetical</option>
		<option value={ShowSorting.mostVideos}>Most Videos</option>
	</select>
	<ul>
		{#each sortedShows as show}
			<li>
				<a href="/shows/{show.id}">
					<img
						src={show.poster ? `/shows/${show.poster}` : '/assets/default.jpg'}
						alt=""
					/>
					<h2>{show.title}</h2>
					<p>{show.description}</p>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	h2 {
		font-size: 16px;
		line-height: 20px;
		margin: 0;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	ul a {
		display: block;
		color: var(--color-gray);
	}

	ul a:hover h2 {
		color: var(--color-red-active);
	}

	ul img {
		display: block;
		margin-bottom: 5px;
		width: 100%;
	}

	ul li {
		margin-bottom: 30px;
	}

	select {
		appearance: none;
		background: #394046 url(/assets/bg-select-dark.png) right;
		background-size: auto 100%;
		color: #dedede;
		padding-left: 8px;
		margin-bottom: 10px;
		box-shadow:
			rgba(255, 255, 255, 0.2) 0 1px 0 inset,
			rgba(0, 0, 0, 0.25) 0 1px 1px;
		text-shadow: rgba(0, 0, 0, 0.5) 0 1px 0;
		width: 120px;
		border: 1px solid #0b0d0e;
		height: 22px;
		border-radius: 3px;
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
