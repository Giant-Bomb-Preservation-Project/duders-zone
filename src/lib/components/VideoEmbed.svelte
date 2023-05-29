<script lang="ts">
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import type { Video } from '$lib/data'

	export let video: Video
</script>

<main>
	<div class="container">
		<div id="container">
			<div id="splash" style="background-image: url('{video.thumbnail}');"></div>
			<div id="metadata">
				<h2>{video.title}</h2>
				<p>{video.description}</p>
				<time datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
			</div>
			<div id="video">
				<FrameEmbed
					src="https://archive.org/embed/{video.id}"
					title={video.title}
				/>
			</div>
		</div>
	</div>
</main>

<style>
	main {
		background: black;
		color: white;
		font-family: var(--font-special);
		padding: 16px 0;
	}

	h2 {
		font-size: 30px;
		font-weight: normal;
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

	#splash {
		display: none;
	}

	#video {
		margin: 20px 0;
	}

	@media (min-width: 992px) {
		h2 {
			font-size: 32px;
			line-height: 35px;
		}

		main {
			padding: 0;
			text-shadow: rgba(0,0,0,0.9) 0 1px 0;
		}

		p {
			font-size: 21px;
			line-height: 30px;
		}

		#container {
			display: flex;
			padding: 24px 0 64px;
			overflow: hidden;
			position: relative;
		}

		#metadata {
			position: relative;
			z-index: 2;
		}

		#splash {
			background: black center center no-repeat;
			background-size: cover;
			display: block;
			filter: blur(10px);
			height: 100%;
			opacity: 0.5;
			position: absolute;
			width: 100%;
			top: 0;
			z-index: 1;
		}

		#splash::after {
			content: " ";
			width: 400px;
			height: 100%;
			background: url(/assets/bg-kubrick-fade-left.png) left top repeat-y;
			display: block;
			top: 0;
			left: 0;
			position: absolute;
		}

		#splash::before {
			content: " ";
			width: 400px;
			height: 100%;
			background: url(/assets/bg-kubrick-fade-right.png) right top repeat-y;
			display: block;
			top: 0;
			right: 0;
			position: absolute;
		}

		#video {
			margin: 0 0 0 32px;
			flex: 0 0 620px;
			position: relative;
			z-index: 2;
		}
	}

	@media (min-width: 1200px) {
		#video {
			margin-left: 90px;
		}
	}
</style>
