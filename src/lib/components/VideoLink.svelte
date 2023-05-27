<script lang="ts">
	import type { Video } from '$lib/data'

	export let video: Video
	export let href: string
</script>

<a {href}>
	<img src={video.image} alt="">
	<strong>{video.title}</strong>
	<time class="secondary" datetime={video.publicationDate.toISOString()}>{video.publicationDate.toLocaleDateString()}</time>
</a>

<style>
	strong,
	time {
		display: block;
	}
</style>
