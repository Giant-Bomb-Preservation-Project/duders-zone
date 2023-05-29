<script lang="ts">
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoLink from '$lib/components/VideoLink.svelte'
	import { getRandomVideos } from '$lib/data'
	import type { PageData } from './$types'

	export let data: PageData

	$: videos = getRandomVideos(12)

	function randomize() {
		videos = getRandomVideos(12)
	}
</script>

<section>
	<VideoEmbed video={data.video} />
</section>

<section>
	<ul>
		{#each videos as video}
			<li>
				<VideoLink {video} href="/random/{video.id}" />
			</li>
		{/each}
	</ul>
</section>

<section>
	<button on:click={randomize}>
		Randomize
	</button>
</section>
