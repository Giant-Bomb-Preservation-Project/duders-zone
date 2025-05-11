<script lang="ts">
	import { base } from '$app/paths'
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import Splash from '$lib/components/Splash.svelte'
	import { VideoSource } from '$lib/data'
	import type { Video } from '$lib/data'
	import { preferredSource } from '$lib/store.js'

	interface Props {
		video: Video
		linkToVideo?: Boolean
	}

	const { video, linkToVideo = false }: Props = $props()
	const thumbnail = video.thumbnail || `${base}/assets/default.jpg`
	let isWide = $state(false)
	let videoSource = $derived.by(() => {
		let availableSources: Array<VideoSource> = []

		if (video.source.internetarchive) {
			if ($preferredSource === VideoSource.InternetArchive) {
				return VideoSource.InternetArchive
			}

			availableSources.push(VideoSource.InternetArchive)
		}

		if (video.source.direct) {
			if ($preferredSource === VideoSource.Direct) {
				return VideoSource.Direct
			}

			availableSources.push(VideoSource.Direct)
		}

		if (video.source.youtube) {
			if ($preferredSource === VideoSource.YouTube) {
				return VideoSource.YouTube
			}

			availableSources.push(VideoSource.YouTube)
		}

		return availableSources[0]
	})
</script>

<Splash image={thumbnail}>
	<div class="video-container" class:wide={isWide}>
		<div class="metadata">
			{#if linkToVideo}
				<a href={`${base}/videos/${video.show}/${video.id}`}>
					<h3>{video.title}</h3>
					<p>{video.description}</p>
					<time datetime={video.date.toISOString()}
						>{video.date.toLocaleDateString()}</time
					>
				</a>
			{:else}
				<h3>{video.title}</h3>
				<p>{video.description}</p>
				<time datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
			{/if}
		</div>
		<div class="video">
			{#if videoSource == VideoSource.Direct}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video controls poster={thumbnail}>
					<source src={video.source.direct} type="video/mp4" />
					<a href={video.source.direct}>Download</a>
				</video>
			{:else if videoSource == VideoSource.YouTube}
				<FrameEmbed
					src="https://www.youtube.com/embed/{video.source.youtube}"
					title={video.title}
				/>
			{:else if videoSource == VideoSource.InternetArchive}
				<FrameEmbed
					src="https://archive.org/embed/{video.source.internetarchive}"
					title={video.title}
				/>
			{/if}
			<ul class="video-controls">
				<li>
					<span class="link link-gear">Settings</span>
					<div class="controls">
						<h4>Source</h4>
						<button
							title="Use Internet Archive video source"
							onclick={() => preferredSource.set(VideoSource.InternetArchive)}
							class:current={$preferredSource === VideoSource.InternetArchive}
							disabled={!video.source.internetarchive}
						>
							Internet Archive
						</button>
						<button
							title="Use direct video source"
							onclick={() => preferredSource.set(VideoSource.Direct)}
							class:current={$preferredSource === VideoSource.Direct}
							disabled={!video.source.direct}
						>
							Direct
						</button>
						<button
							title="Use YouTube video source"
							onclick={() => preferredSource.set(VideoSource.YouTube)}
							class:current={$preferredSource === VideoSource.YouTube}
							disabled={!video.source.youtube}
						>
							YouTube
						</button>
						<hr />
						<button title="Make video bigger" onclick={() => (isWide = !isWide)}>
							{isWide ? 'Debiggen' : 'Embiggen'}
						</button>
					</div>
				</li>
			</ul>
		</div>
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

	.metadata a {
		color: white;
		text-shadow: rgba(0, 0, 0, 0.9) 0 1px 0;
		transition: text-shadow 0.25s;
	}

	.metadata a:hover {
		text-shadow: rgba(255, 255, 255, 0.75) 0 0 10px;
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
		text-shadow:
			#007fff 0 0 3px,
			#007fff 0 0 5px;
	}

	.video-controls h4 {
		font-family: inherit;
		font-weight: bold;
		margin: 0.25em 0;
	}

	.video-controls hr {
		background-image: url(/assets/bg-border-dark.png);
		border: 0;
		height: 2px;
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
		text-shadow:
			#007fff 0 0 3px,
			#007fff 0 0 5px;
	}

	.video-controls li:hover .link-gear {
		background-position: left -162px;
	}

	.video-controls .controls {
		background-color: #1d1f20;
		box-shadow:
			rgba(0, 0, 0, 0.25) 0 0 10px inset,
			rgba(255, 255, 255, 0.15) 0 1px 0 inset,
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

	.video-container.wide {
		display: flex;
		flex-direction: column;
		margin: 0 var(--negative-spacing);
	}

	.video-container.wide .metadata {
		order: 2;
		padding: 0 var(--spacing);
	}

	.video-container.wide .video {
		margin: 0 0 var(--spacing) !important;
		order: 1;
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

		.video-container {
			display: flex;
		}

		.video-container.wide {
			margin: 0;
		}

		.video-container.wide .metadata {
			padding: 0;
		}

		.video-container.wide .video {
			flex: 0;
		}
	}

	@media (min-width: 1200px) {
		.video {
			margin-left: 90px;
		}
	}
</style>
