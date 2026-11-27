<script lang="ts">
	import { base } from '$app/paths'
	import { byNameAsc, type Person, type Video } from '$lib/data'
	import { VideoListMode, VideoListSorting } from '$lib/types'
	import Header from '$lib/components/Header.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import Thumbnail from '$lib/components/Thumbnail.svelte'
	import { videoListMode, videoListSorting } from '$lib/store'
	import ListButtons from './ListButtons.svelte'
	import { IconType } from './Icon.svelte'
	import HostFilter from './HostFilter.svelte'
	import { onMount } from 'svelte'

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
		filterable?: boolean
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
		filterable = false,
	}: Props = $props()

	let videosReversed = $derived([...videos].reverse())
	let sortedVideos = $derived(
		$videoListSorting === VideoListSorting.NewestFirst || !sortable ? videos : videosReversed
	)

	let showHostFilter = $state(false)
	let hosts = $derived.by(() => {
		if (!filterable) return []
		const hostsSet: Set<Person> = new Set()
		videos.forEach((video) => video.hosts.forEach((host) => hostsSet.add(host)))
		return [...hostsSet].sort(byNameAsc)
	})
	// svelte-ignore state_referenced_locally
	let filteredVideos = $state(videos)

	let totalPages = $derived(perPage != -1 ? Math.ceil(filteredVideos.length / perPage) : 1)
	let currentPage = $derived.by(() => {
		if (!currentVideo || pageNumber) {
			return Math.min(pageNumber ?? 1, totalPages)
		}

		// Determine which page the current video is on
		for (let i = 0; i < filteredVideos.length; i++) {
			if (filteredVideos[i].id === currentVideo.id) {
				return Math.floor(i / perPage) + 1
			}
		}

		return 1 // In case current video isn't in filtered list
	})
	let paginatedVideos = $derived.by(() => {
		if (perPage == -1) {
			return filteredVideos
		}

		const itemIndexStart = (currentPage - 1) * perPage
		return filteredVideos.slice(itemIndexStart, itemIndexStart + perPage)
	})

	// If videos get re-sorted on load, thumbnails will be wrong, so hide them initially
	// svelte-ignore state_referenced_locally
	let hideThumbnails = $state(sortable)

	onMount(() => {
		hideThumbnails = false
	})
</script>

<Header {title}>
	{#if seeAllUrl}
		<div class="see-all">&middot; <a href={seeAllUrl}>See All</a></div>
	{/if}
	<div class="controls">
		{#if filterable}
			<ListButtons
				value={showHostFilter}
				onChange={() => (showHostFilter = !showHostFilter)}
				options={[{ label: 'Filter', icon: IconType.Patreon, option: true }]}
			/>
			<div class="divider mobile-hidden"></div>
		{/if}
		{#if sortable}
			<ListButtons
				value={$videoListSorting}
				onChange={(option) => videoListSorting.set(option)}
				options={[
					{
						label: 'Newest',
						icon: IconType.NewestFirst,
						option: VideoListSorting.NewestFirst,
					},
					{
						label: 'Oldest',
						icon: IconType.OldestFirst,
						option: VideoListSorting.OldestFirst,
					},
				]}
			/>
			{#if !mode}
				<div class="divider mobile-hidden"></div>
			{/if}
		{/if}
		{#if !mode}
			<div class="mobile-hidden">
				<ListButtons
					value={$videoListMode}
					onChange={(option) => videoListMode.set(option)}
					options={[
						{
							label: 'List',
							icon: IconType.List,
							option: VideoListMode.List,
						},
						{
							label: 'Grid',
							icon: IconType.Grid,
							option: VideoListMode.Grid,
						},
					]}
				/>
			</div>
		{/if}
	</div>
</Header>
{#if filterable}
	<HostFilter videos={sortedVideos} {hosts} bind:filteredVideos hidden={!showHostFilter} />
{/if}
<ul class={mode ?? $videoListMode}>
	{#each paginatedVideos as video (video.id)}
		<li>
			<a href="{rootUri || `${base}/videos/${video.show}`}/{video.id}">
				<div class="thumbnail-wrapper">
					<div class="thumbnail">
						<Thumbnail
							src={hideThumbnails || !video.thumbnail
								? '/assets/default.jpg'
								: video.thumbnail}
							alt=""
						/>
						<span class="duration">{video.duration}</span>
					</div>
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

{#if perPage !== -1}
	<Pagination
		totalResults={filteredVideos.length}
		{currentPage}
		{totalPages}
		filtered={filteredVideos.length < videos.length}
	/>
{/if}

<style>
	.controls {
		display: flex;
		align-items: center;
		margin-left: auto;
	}

	.controls .divider {
		height: 80%;
		width: 0;
		border-left: 1px solid rgba(0, 0, 0, 0.3);
		margin: 0 8px;
		box-shadow: 1px 0 0 rgba(255, 255, 255, 0.08);
	}

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

	ul a:hover .thumbnail::before {
		display: block;
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
		background-image: none !important;
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

	.thumbnail {
		position: relative;
	}

	.thumbnail :global(.thumbnail) {
		box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
	}

	.thumbnail::before {
		content: ' ';
		display: none;
		position: absolute;
		left: 50%;
		top: 50%;
		height: 0;
		float: left;
		background: url(/assets/av-splash-65x65.png) no-repeat center top;
		background-size: 100% auto;
		width: 65px;
		padding-top: 65px;
		margin-top: -33px;
		margin-left: -33px;
		z-index: 1;
	}

	.thumbnail .duration {
		background: black;
		border-radius: 100px;
		bottom: var(--spacing-less);
		box-shadow: rgba(255, 255, 255, 0.25) 0 1px 1px;
		color: white;
		font-size: 12px;
		left: var(--spacing-less);
		line-height: 16px;
		padding: 1px 6px 0;
		position: absolute;
		text-shadow: rgba(0, 0, 0, 0.5) 0 -1px 0;
	}

	@media (min-width: 576px) {
		ul {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			column-gap: 30px;
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

		.thumbnail-wrapper {
			flex: 0 0 220px;
		}

		ul:not(.grid) .thumbnail-wrapper {
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

		.thumbnail-wrapper {
			flex: 0 0 260px;
		}
	}
</style>
