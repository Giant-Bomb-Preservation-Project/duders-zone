<script lang="ts">
	import { base } from '$app/paths'
	import type { Video } from '$lib/data'
	import { VideoListMode, VideoListSorting } from '$lib/types'
	import Header from '$lib/components/Header.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import Thumbnail from '$lib/components/Thumbnail.svelte'
	import { videoListMode, videoListSorting } from '$lib/store.js'
	import Icon, { IconType } from './Icon.svelte'

	interface Props {
		videos: Video[]
		title: string
		currentVideo?: Video
		rootUri?: string
		seeAllUrl?: string
		mode?: VideoListMode
		perPage?: number
		pageNumber?: number | null
		sortable?: boolean
	}

	const {
		videos,
		title,
		currentVideo,
		rootUri,
		seeAllUrl,
		mode,
		perPage = -1,
		pageNumber = null,
		sortable = true,
	}: Props = $props()

	let videosReversed = $derived([...videos].reverse())
	let sortedVideos = $derived(
		$videoListSorting === VideoListSorting.NewestFirst ? videos : videosReversed
	)

	let totalPages = $derived(perPage != -1 ? Math.ceil(videos.length / perPage) : 1)
	let currentPage = $derived.by(() => {
		if (!currentVideo || pageNumber || perPage === -1) {
			return pageNumber ?? 1
		}

		// Determine which page the current video is on
		for (let i = 0; i < sortedVideos.length; i++) {
			if (sortedVideos[i].id === currentVideo.id) {
				return Math.floor(i / perPage) + 1
			}
		}

		return 1 // shouldn't happen, but just in case
	})
	let paginatedVideos = $derived.by(() => {
		if (perPage == -1) {
			return sortedVideos
		}

		const itemIndexStart = (currentPage - 1) * perPage
		return sortedVideos.slice(itemIndexStart, itemIndexStart + perPage)
	})
</script>

<Header {title}>
	{#if seeAllUrl}
		<div class="see-all">&middot; <a href={seeAllUrl}>See All</a></div>
	{/if}
	<div class="controls">
		{#if sortable}
			<button
				class:active={$videoListSorting == VideoListSorting.NewestFirst}
				onclick={() => {
					videoListSorting.set(VideoListSorting.NewestFirst)
				}}
			>
				<Icon type={IconType.NewestFirst} />
				Newest
			</button>
			<button
				class:active={$videoListSorting == VideoListSorting.OldestFirst}
				onclick={() => {
					videoListSorting.set(VideoListSorting.OldestFirst)
				}}
			>
				<Icon type={IconType.OldestFirst} />
				Oldest
			</button>
		{/if}
		{#if !mode && sortable}
			<div class="divider mobile-hidden"></div>
		{/if}
		{#if !mode}
			<button
				class="mobile-hidden"
				class:active={$videoListMode == VideoListMode.List}
				onclick={() => {
					videoListMode.set(VideoListMode.List)
				}}
			>
				<Icon type={IconType.List} />
				List
			</button>
			<button
				class="mobile-hidden"
				class:active={$videoListMode == VideoListMode.Grid}
				onclick={() => {
					videoListMode.set(VideoListMode.Grid)
				}}
			>
				<Icon type={IconType.Grid} />
				Grid
			</button>
		{/if}
	</div>
</Header>

<ul class={mode ?? $videoListMode}>
	{#each paginatedVideos as video (video.id)}
		<li>
			<a href="{rootUri || `${base}/videos/${video.show}`}/{video.id}">
				<div class="thumbnail">
					<Thumbnail src={video.thumbnail || '/assets/default.jpg'} alt="" />
				</div>
				<div class="metadata">
					<h3>{video.title}</h3>
					<time datetime={video.date.toISOString()}
						>{video.date.toLocaleDateString()}</time
					>
					<p>{video.description}</p>
				</div>
			</a>
		</li>
	{/each}
</ul>

{#if !seeAllUrl}
	<Pagination totalResults={videos.length} {currentPage} {totalPages} />
{/if}

<style>
	h3 {
		font-size: 21px;
		line-height: 25px;
		margin: var(--spacing-less) 0 0;
	}

	time {
		display: block;
		font-family: Georgia, serif;
		font-style: italic;
		margin: 0 0 5px 0;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	ul a {
		display: block;
		color: var(--color-text-muted);
	}

	ul a:hover h3 {
		color: var(--color-red-active);
	}

	ul li {
		background-position: bottom;
		background-image: url(/assets/bg-border-light.png);
		background-repeat: repeat-x;
		padding: 15px 0 17px;
	}

	:global([data-theme='dark']) ul li {
		background-image: url(/assets/bg-border-dark.png);
	}

	ul li:last-child {
		background-image: none;
	}

	.controls {
		display: flex;
		align-items: center;
		margin-left: auto;
	}

	.controls button {
		background: none;
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		font-family: inherit;
		font-size: 14px;
		line-height: 20px;
	}

	.controls button:hover {
		color: var(--color-red-active);
	}

	.controls button.active {
		color: var(--color-text);
	}

	.controls .divider {
		height: 80%;
		width: 0;
		border-left: 1px solid rgba(0, 0, 0, 0.3);
		margin: 0 8px;
		box-shadow: 1px 0 0 rgba(255, 255, 255, 0.08);
	}

	.mobile-hidden {
		display: none;
	}

	.metadata {
		color: var(--color-text-muted);
		font-size: 14px;
		line-height: 20px;
	}

	.metadata h3 {
		color: var(--color-text);
	}

	.thumbnail :global(.thumbnail) {
		box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
	}

	@media (min-width: 576px) {
		ul {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			column-gap: 10px;
		}

		ul li,
		:global([data-theme='dark']) ul li {
			background-image: none;
		}
	}

	@media (min-width: 768px) {
		ul.list {
			display: block;
		}

		ul.list a {
			display: flex;
		}

		ul.list li {
			background-image: url(/assets/bg-border-light.png);
		}

		:global([data-theme='dark']) ul.list li {
			background-image: url(/assets/bg-border-dark.png);
		}

		ul.grid h3 {
			font-size: 18px;
			line-height: 21px;
		}

		.mobile-hidden {
			display: block;
		}

		.thumbnail {
			flex: 0 0 220px;
			margin-right: var(--spacing);
		}
	}

	@media (min-width: 992px) {
		ul.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1200px) {
		ul.grid {
			grid-template-columns: repeat(4, 1fr);
		}

		.thumbnail {
			flex: 0 0 260px;
		}
	}
</style>
