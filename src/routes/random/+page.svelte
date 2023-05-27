<script lang="ts">
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import { getRandomVideo } from '$lib/data'

	$: video = getRandomVideo()
</script>

<h1>Random</h1>

<section>
	<FrameEmbed
		src="https://archive.org/embed/{video.id}"
		title={video.title}
	/>
</section>

<section id="more">
	<a role="button" href="/random">Another Random Video</a>
</section>

<style>
	#more {
		text-align: center;
	}
</style>
