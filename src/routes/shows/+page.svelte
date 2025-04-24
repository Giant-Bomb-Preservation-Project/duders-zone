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
	<form>
		<select id="sorting" bind:value={sorting}>
			<option value={ShowSorting.alphabetical}>Alphabetical</option>
			<option value={ShowSorting.mostVideos}>Most Videos</option>
		</select>
	</form>
	<ul>
		{#each sortedShows as show}
			<li>
				<a href="/shows/{show.id}">
					<img
						src={show.poster ? `/assets/shows/${show.poster}` : '/assets/default.jpg'}
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
	form {
		margin-bottom: var(--spacing);
	}

	h2 {
		font-size: 16px;
		line-height: 20px;
		margin: 0;
	}

	select {
		width: 150px;
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
