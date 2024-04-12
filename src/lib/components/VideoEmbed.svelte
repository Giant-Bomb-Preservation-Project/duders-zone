<script lang="ts">
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import Splash from '$lib/components/Splash.svelte'
	import { VideoSource } from '$lib/data'
	import type { Video } from '$lib/data'
	import { preferredSource } from '$lib/store.js'

	export let video: Video

	function setSource(source: VideoSource) {
		preferredSource.set(source)
	}
</script>

<Splash image={video.thumbnail || '/assets/default.jpg'}>
	<div class="metadata">
		<h3>{video.title}</h3>
		<p>{video.description}</p>
		<time datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
	</div>
	<div class="video">
		{#if $preferredSource == VideoSource.Direct && video.source.direct}
			<video controls src={video.source.direct} />
		{:else if $preferredSource == VideoSource.YouTube && video.source.youtube}
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
		<ul class="video-controls">
			<li>
				<span class="link link-gear">Source</span>
				<div class="controls">
					<button
						title="Use Internet Archive video source"
						on:click={() => setSource(VideoSource.InternetArchive)}
						class:current={$preferredSource === VideoSource.InternetArchive}
						disabled={!video.source.internetarchive}
					>
						Internet Archive
					</button>
					<button
						title="Use direct video source"
						on:click={() => setSource(VideoSource.Direct)}
						class:current={$preferredSource === VideoSource.Direct}
						disabled={!video.source.direct}
					>
						Direct
					</button>
					<button
						title="Use YouTube video source"
						on:click={() => setSource(VideoSource.YouTube)}
						class:current={$preferredSource === VideoSource.YouTube}
						disabled={!video.source.youtube}
					>
						YouTube
					</button>
				</div>
			</li>
		</ul>
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

	video {
		display: block;
		width: 100%;
	}

	.video {
		margin: var(--spacing) 0;
	}

	.video-controls {
		background: #1d1f20;
		background-image: linear-gradient(#292b2e, rgba(29, 31, 32, 0));
		background-repeat: repeat-x;
		box-shadow: #3c4044 0 1px 0 inset;
		color: #afb3b6;
		display: flex;
		font-family: var(--font-regular);
		font-weight: bold;
		font-size: 10px;
		justify-content: flex-end;
		margin: 0;
		list-style: none;
		padding: 0 5px;
	}

	.video-controls button {
		background: none;
		border: 0;
		color: inherit;
		cursor: pointer;
		display: block;
		font-size: inherit;
		font-weight: inherit;
		margin: 0;
		padding: 5px;
		text-align: left;
	}

	.video-controls button:disabled {
		opacity: 0.3;
	}

	.video-controls button:hover:not(:disabled),
	.video-controls button.current {
		color: #f5faff;
		text-shadow: #007fff 0 0 3px, #007fff 0 0 5px;
	}

	.video-controls li {
		margin: 0 5px;
		padding: 8px 5px;
		position: relative;
	}

	.video-controls li:hover .controls {
		display: block;
	}

	.video-controls li:hover .link {
		color: #f5faff;
		text-shadow: #007fff 0 0 3px, #007fff 0 0 5px;
	}

	.video-controls li:hover .link-gear {
		background-position: left -162px;
	}

	.video-controls .controls {
		background-color: #1d1f20;
		box-shadow: rgba(0, 0, 0, 0.25) 0 0 10px inset, rgba(255, 255, 255, 0.15) 0 1px 0 inset,
			rgba(0, 0, 0, 0.75) 0 0 5px;
		border-radius: 3px;
		border: 1px solid #111213;
		bottom: 30px;
		display: none;
		left: -48px;
		position: absolute;
		padding: 5px 10px;
		width: 100px;
	}

	.video-controls .controls::before {
		content: ' ';
		border-top: 6px solid #111213;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		position: absolute;
		display: block;
		top: 100%;
		left: 50%;
		margin-left: -5px;
	}

	.video-controls .link {
		background: url(/assets/av-sprite@2x.png) no-repeat left center;
		background-size: 20px auto;
		cursor: pointer;
		display: block;
		height: 16px;
		line-height: 16px;
		padding-left: 20px;
		overflow: hidden;
	}

	.video-controls .link-gear {
		background-position: left -142px;
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
