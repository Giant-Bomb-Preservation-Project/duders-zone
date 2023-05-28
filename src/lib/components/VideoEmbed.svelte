<script lang="ts">
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import type { Video } from '$lib/data'

	export let video: Video
</script>

<FrameEmbed
	src="https://archive.org/embed/{video.id}"
	title={video.title}
/>
<h2>{video.title}</h2>
<p>{video.description}</p>
<p class="secondary">
	Originally published on
	<time datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
</p>
