<script lang="ts">
	import { getShows } from '$lib/data'
	import ShowLink from '$lib/components/ShowLink.svelte'

	const shows = getShows()
</script>

<h1>Shows</h1>

<ul>
	{#each shows as show}
		<li>
			<ShowLink {show} />
		</li>
	{/each}
</ul>

<style>
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

