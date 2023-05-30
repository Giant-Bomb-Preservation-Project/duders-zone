<script lang="ts">
	import type { Video } from '$lib/data'

	export let video: Video
	export let href: string

	const imageSrc = video.thumbnail || '/assets/default.jpg'
</script>

<a {href}>
	<img src={imageSrc} alt="">
	<strong>{video.title}</strong>
	<time datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
</a>

<style>
	img {
		width: 100%;
	}

	strong,
	time {
		display: block;
	}
</style>
