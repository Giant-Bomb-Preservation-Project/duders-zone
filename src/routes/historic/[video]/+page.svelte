<script lang="ts">
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoLink from '$lib/components/VideoLink.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<h1>
	Historic
</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section>
	<ul>
		{#each data.videos as video}
			<li>
				<VideoLink {video} href="/historic/{video.id}" />
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

