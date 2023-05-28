<script lang="ts">
	import type { Video } from '$lib/data'

	export let video: Video
	export let href: string

	const imageSrc = video.thumbnail || '/shows/default.jpg'
</script>

<a {href}>
	<img src={imageSrc} alt="">
	<strong>{video.title}</strong>
	<time class="secondary" datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
</a>

<style>
	strong,
	time {
		display: block;
	}
</style>
