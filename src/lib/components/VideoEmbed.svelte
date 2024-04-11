<script lang="ts">
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import Splash from '$lib/components/Splash.svelte'
	import { VideoSource } from '$lib/data'
	import type { Video } from '$lib/data'
	import noVideo from '$lib/images/novideo.png'

	export let video: Video
	export let videoSource: VideoSource = VideoSource.InternetArchive
</script>

<Splash image={video.thumbnail || '/assets/default.jpg'}>
	<div class="metadata">
		<h3>{video.title}</h3>
		<p>{video.description}</p>
		<time datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
	</div>
	<div class="video">
		{#if videoSource == VideoSource.YouTube && video.source.youtube}
			<FrameEmbed
				src="https://www.youtube.com/embed/{video.source.youtube}"
				title={video.title}
			/>
		{:else}
			<FrameEmbed
				src="https://archive.org/embed/{video.source.internetarchive}"
				title={video.title}
			/>
		{/if}
		<div class="source-selector">
			<span class="sr-only">Source</span>
			{#if video.source.youtube}
				<label title="Use YouTube video source">
					<input
						type="radio"
						name="source"
						value={VideoSource.YouTube}
						bind:group={videoSource}
					/>
					<svg
						viewBox="0 -38 256 256"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						preserveAspectRatio="xMidYMid"
					>
						<g>
							<path
								d="M250.346231,28.0746923 C247.358133,17.0320558 238.732098,8.40602109 227.689461,5.41792308 C207.823743,0 127.868333,0 127.868333,0 C127.868333,0 47.9129229,0.164179487 28.0472049,5.58210256 C17.0045684,8.57020058 8.37853373,17.1962353 5.39043571,28.2388718 C-0.618533519,63.5374615 -2.94988224,117.322662 5.5546152,151.209308 C8.54271322,162.251944 17.1687479,170.877979 28.2113844,173.866077 C48.0771024,179.284 128.032513,179.284 128.032513,179.284 C128.032513,179.284 207.987923,179.284 227.853641,173.866077 C238.896277,170.877979 247.522312,162.251944 250.51041,151.209308 C256.847738,115.861464 258.801474,62.1091 250.346231,28.0746923 Z"
								fill="#FF0000"
							/>
							<polygon
								fill="#FFFFFF"
								points="102.420513 128.06 168.749025 89.642 102.420513 51.224"
							/>
						</g>
					</svg>
				</label>
			{/if}
			{#if video.source.internetarchive}
				<label title="Use Internet Archive video source">
					<input
						type="radio"
						name="source"
						value={VideoSource.InternetArchive}
						bind:group={videoSource}
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Internet Archive"
						role="img"
						viewBox="0 0 512 512"
					>
						<rect width="512" height="512" rx="15%" fill="#ffffff" />
						<path
							d="m81 419h350v18h-350zm14-34h323v25h-323zm-2-284h321v35h-321zm319-10 10-11-169-39-168 39 10 11h158zm-273 154-1-51-3-47c0-2 0-2-2-2a67 67 0 0 0 -28 0c-1 0-2 0-2 2l-2 47a2223 2223 0 0 0 0 127l2 43 1 8 15 3c6-1 11-1 16-3l1-8 2-43a1616 1616 0 0 0 1-76zm88 0-2-51-2-47c0-2-1-2-2-2a67 67 0 0 0 -28 0c-2 0-2 0-2 2l-3 47a2223 2223 0 0 0 0 127l2 43 1 8c5 2 11 2 16 3l16-3v-8l2-43a1620 1620 0 0 0 2-76zm101 0-1-51-3-47c0-2 0-2-2-2a67 67 0 0 0 -28 0c-1 0-2 0-2 2l-2 47a2223 2223 0 0 0 0 127l2 43 1 8 15 3c5-1 11-1 16-3l1-8 2-43a1624 1624 0 0 0 1-76zm85 0-1-51-2-47c0-2-1-2-2-2a67 67 0 0 0 -29 0l-1 2-3 47a2227 2227 0 0 0 0 127l2 43 1 8c5 2 10 2 16 3l15-3 1-8 2-43a1620 1620 0 0 0 1-76z"
						/>
					</svg>
				</label>
			{/if}
		</div>
	</div>
</Splash>

<style>
	h3 {
		font-size: 30px;
		margin: 0;
	}

	input[type='radio'] {
		display: none;
	}

	label {
		cursor: pointer;
		opacity: 0.4;
		padding: 0 0.15em;
	}

	label:hover,
	label:has(input[type='radio']:checked) {
		opacity: 1;
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

	.source-selector {
		font-size: 18px;
		margin-top: 0.5em;
		text-align: right;
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
