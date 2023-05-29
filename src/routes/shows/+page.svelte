<script lang="ts">
	import ShowLink from '$lib/components/ShowLink.svelte'
	import type { PageData } from './$types'

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
