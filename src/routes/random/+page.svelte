<script lang="ts">
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import { getRandomVideo } from '$lib/data'

	$: video = getRandomVideo()

	function randomize() {
		video = getRandomVideo()
	}
</script>

<h1>Random</h1>

<section>
	<VideoEmbed {video} />
</section>

<section>
	<button on:click={randomize}>
		Another Random Video
	</button>
</section>
