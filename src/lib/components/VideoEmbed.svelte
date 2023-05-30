<script lang="ts">
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import Splash from '$lib/components/Splash.svelte'
	import type { Video } from '$lib/data'

	export let video: Video
</script>

<Splash image={video.thumbnail || "/shows/default.jpg"}>
	<div class="metadata">
		<h3>{video.title}</h3>
		<p>{video.description}</p>
		<time datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
	</div>
	<div class="video">
		<FrameEmbed
			src="https://archive.org/embed/{video.id}"
			title={video.title}
		/>
	</div>
</Splash>

<style>
	h3 {
		font-size: 30px;
		margin: 0;
	}

	p {
		font-size: 14px;
		line-height: 20px;
		margin: 10px 0;
	}

	time {
		font-size: 18px;
		line-height: 20px;
	}

	.video {
		margin: var(--spacing) 0;
	}

	@media (min-width: 992px) {
		h3 {
			font-size: 32px;
			line-height: 35px;
		}

		p {
			font-size: 21px;
			line-height: 30px;
		}

		.metadata {
			position: relative;
			z-index: 2;
		}

		.video {
			margin: 0 0 0 32px;
			flex: 0 0 620px;
			position: relative;
			z-index: 2;
		}
	}

	@media (min-width: 1200px) {
		.video {
			margin-left: 90px;
		}
	}
</style>
