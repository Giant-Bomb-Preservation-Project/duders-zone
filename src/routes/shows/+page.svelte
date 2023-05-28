<script lang="ts">
	import ShowLink from '$lib/components/ShowLink.svelte'

	export let data: PageData
</script>

<h1>Shows</h1>

<ul>
	{#each data.shows as show}
		<li>
			<ShowLink {show} />
		</li>
	{/each}
</ul>

<style>
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

