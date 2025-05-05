<script lang="ts">
	import { base } from '$app/paths'
	import type { Video } from '$lib/data'
	import { VideoListMode, VideoListSorting } from '$lib/types'
	import Header from '$lib/components/Header.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import Thumbnail from '$lib/components/Thumbnail.svelte'
	import { videoListMode, videoListSorting } from '$lib/store.js'

	interface Props {
		videos: Video[]
		title: string
		rootUri?: string
		seeAllUrl?: string
		mode?: VideoListMode
		perPage?: number
		pageNumber?: number
		sortable?: boolean
	}

	const {
		videos,
		title,
		rootUri,
		seeAllUrl,
		mode,
		perPage = -1,
		pageNumber = 1,
		sortable = true,
	}: Props = $props()

	let videosReversed = $derived([...videos].reverse())
	let sortedVideos = $derived(
		$videoListSorting === VideoListSorting.NewestFirst ? videos : videosReversed
	)

	let totalPages = $derived(perPage != -1 ? Math.ceil(videos.length / perPage) : 1)
	let paginatedVideos = $derived.by(() => {
		if (perPage == -1) {
			return sortedVideos
		}

		const itemIndexStart = (pageNumber - 1) * perPage
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
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"
					><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
						d="M448 96V224H288V96H448zm0 192V416H288V288H448zM224 224H64V96H224V224zM64 288H224V416H64V288zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
					/></svg
				>
				Newest
			</button>
			<button
				class:active={$videoListSorting == VideoListSorting.OldestFirst}
				onclick={() => {
					videoListSorting.set(VideoListSorting.OldestFirst)
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"
					><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
						d="M448 96V224H288V96H448zm0 192V416H288V288H448zM224 224H64V96H224V224zM64 288H224V416H64V288zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
					/></svg
				>
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
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"
					><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
						d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"
					/></svg
				>
				List
			</button>
			<button
				class="mobile-hidden"
				class:active={$videoListMode == VideoListMode.Grid}
				onclick={() => {
					videoListMode.set(VideoListMode.Grid)
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"
					><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
						d="M448 96V224H288V96H448zm0 192V416H288V288H448zM224 224H64V96H224V224zM64 288H224V416H64V288zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
					/></svg
				>
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
	<Pagination totalResults={videos.length} currentPage={pageNumber} {totalPages} />
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
