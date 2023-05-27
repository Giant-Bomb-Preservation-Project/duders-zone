<script lang="ts">
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoLink from '$lib/components/VideoLink.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<h1>
	{#if data.show.logo}
		<img id="logo" src="/shows/{data.show.logo}" alt="{data.show.title}">
	{:else}
		{data.show.title}
	{/if}
</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section>
	<ul>
		{#each data.videos as video}
			<li>
				<VideoLink {video} href="/shows/{data.show.id}/{video.id}" />
			</li>
		{/each}
	</ul>
</section>

<style>
	li {
		list-style: none;
	}

	ul {
		padding: 0;
	}

	#logo {
		display: block;
		max-width: 4em;
		margin-bottom: 1em;
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

