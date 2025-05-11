<script lang="ts">
	import { onMount } from 'svelte'
	import { onNavigate } from '$app/navigation'
	import { base } from '$app/paths'
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte'
	import Splash from '$lib/components/Splash.svelte'
	import { VideoSource } from '$lib/data'
	import { preferredSource, wideVideo } from '$lib/store.js'
	import type { Video } from '$lib/data'
	import type { OnNavigate } from '@sveltejs/kit'

	interface Props {
		video: Video
		linkToVideo?: Boolean
	}

	const { video, linkToVideo = false }: Props = $props()
	const thumbnail = $derived(video.thumbnail || `${base}/assets/default.jpg`)
	let loading = $state(true)
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

	onMount(() => {
		loading = false
	})

	onNavigate((navigation: OnNavigate) => {
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) {
			return // do nothing if we haven't navigated to a new video
		}

		// Force a refresh of the video embed
		loading = true
		setTimeout(() => {
			loading = false
		})
	})
</script>

<Splash image={thumbnail}>
	<div class="video-container" class:wide={$wideVideo}>
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
			{#if loading}
				<div class="video-loading">
					<LoadingIndicator />
				</div>
			{:else}
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
							<button
								title="Make video bigger"
								onclick={() => wideVideo.set(!$wideVideo)}
								class="andre"
							>
								{$wideVideo ? 'Debiggen' : 'Embiggen'}
							</button>
						</div>
					</li>
				</ul>
			{/if}
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

	.video-controls .andre {
		background: transparent url(/assets/icn-andre-48x240.png) 0 0 no-repeat;
		background-size: 24px auto;
		line-height: 24px;
		padding-left: 25px;
	}

	.video-controls .andre,
	.video-container.wide .andre:hover {
		background-position: 0 0;
	}

	.video-controls .andre:hover,
	.video-container.wide .andre {
		background-position: 0 -70px;
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

	.video-loading {
		aspect-ratio: 16/9;
		align-items: center;
		display: flex;
		justify-content: center;
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
			flex: 0 0 268px;
			position: relative;
			z-index: 2;
		}

		.video {
			flex: 1;
			margin: 0 0 0 32px;
			position: relative;
			z-index: 2;
		}

		.video-container {
			display: flex;
		}

		.video-loading {
			height: 380px;
		}

		.video-container.wide {
			margin: 0;
		}

		.video-container.wide .metadata {
			flex: 0;
			padding: 0;
		}

		.video-container.wide .video-loading {
			aspect-ratio: auto;
		}
	}

	@media (min-width: 1200px) {
		.video {
			margin-left: 90px;
		}

		.video-loading {
			height: 464px;
		}
	}
</style>
