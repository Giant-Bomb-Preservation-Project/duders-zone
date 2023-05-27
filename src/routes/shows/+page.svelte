<script lang="ts">
	import { getShows } from '$lib/data'

	const shows = getShows()
</script>

<h1>Shows</h1>

<ul>
	{#each shows as show}
		<li>
			<a href="/shows/{show.id}">
				{#if show.poster}
					<img src="/shows/{show.poster}" alt="">
				{:else}
					<img src="/shows/default.jpg" alt="">
				{/if}
				<strong>{show.title}</strong>
				<span class="secondary">{show.description}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	a > * {
		display: block;
	}

	strong {
		padding-top: 0.5em;
	}

	li {
		list-style: none;
		margin-bottom: 2em;
	}

	ul {
		padding: 0;
	}

	@media (min-width: 768px) {
		ul {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1em;
		}
	}

	@media (min-width: 992px) {
		ul {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>

