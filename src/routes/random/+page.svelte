<script lang="ts">
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import { getRandomVideo } from '$lib/data'

	$: video = getRandomVideo()

	function randomize() {
		video = getRandomVideo()
	}
</script>

<h1>Random</h1>

<section>
	<FrameEmbed
		src="https://archive.org/embed/{video.id}"
		title={video.title}
	/>
	<h2>{video.title}</h2>
	<p>{video.description}</p>
</section>

<section id="more">
	<button on:click={randomize}>
		Another Random Video
	</button>
</section>
