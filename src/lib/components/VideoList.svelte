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
	let hosts = $derived.by(() => {
		if (!filterable) return []
		const hostsSet: Set<Person> = new Set()
		videos.forEach((video) => video.hosts.forEach((host) => hostsSet.add(host)))
		return [...hostsSet].sort(byNameAsc)
	})

	// TODO: Move all host filtering logic and markup into component
	enum HostFilter {
		neutral,
		include,
		exclude,
	}
	// svelte-ignore state_referenced_locally
	let hostFilters = $state(hosts.map(() => HostFilter.neutral))
	let includeHosts = $derived(hosts.filter((_, h) => hostFilters[h] === HostFilter.include))
	let excludeHosts = $derived(hosts.filter((_, h) => hostFilters[h] === HostFilter.exclude))
	let filterActive = $derived(includeHosts.length + excludeHosts.length > 0)
	let matchAnyIncludedHost = $state(false)
	let filteredVideos = $derived(
		filterActive
			? sortedVideos.filter((v) =>
					matchAnyIncludedHost
						? includeHosts.some((ih) => v.hosts.find((h) => h.id === ih.id))
						: includeHosts.every((ih) => v.hosts.find((h) => h.id === ih.id)) &&
							excludeHosts.every((eh) => !v.hosts.find((h) => h.id === eh.id))
				)
			: sortedVideos
	)
	let showHostFilter = $state(false)

	function changeFilter(hostIndex: number) {
		const oldVideoCount = filteredVideos.length
		hostFilters[hostIndex] = (hostFilters[hostIndex] + 1) % 3
		console.log(oldVideoCount, filteredVideos.length)
		if (filteredVideos.length !== oldVideoCount) {
			currentPage = 1 // Reset page number if video count has changed
		}
	}

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
{#if filterable && showHostFilter}
	<div class="host-filter">
		<h2>Filter by hosts</h2>
		{#if filterActive}
			<button onclick={() => (hostFilters = hosts.map(() => HostFilter.neutral))}>
				Reset
			</button>
		{/if}
		<div class="host-list">
			{#each hosts as host, h}
				{@const include = hostFilters[h] === HostFilter.include}
				{@const exclude = hostFilters[h] === HostFilter.exclude}
				<button
					class:include
					class:exclude
					title="{include ? 'Exclude' : exclude ? 'Reset' : 'Include'} {host.name}"
					onclick={() => changeFilter(h)}>{host.name}</button
				>
			{/each}
		</div>
		<div style="display: flex; flex-direction: column;">
			<label>
				<input type="checkbox" bind:checked={matchAnyIncludedHost} />
				Include videos with any of these hosts
			</label>
		</div>
	</div>
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
		filtered={filterActive}
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

	h2 {
		font-size: 16px;
	}

	.host-filter {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 1em;
		width: 100%;
	}

	.host-filter button {
		height: 32px;
		font-weight: bold;
		background: var(--color-gray) url(/assets/bg-button.png) center center repeat-x;
		color: #dedede;
		text-shadow: rgba(0, 0, 0, 0.5) 0 1px 0;
		padding: 0 1em;
		border: 1px solid #0b0d0e;
		border-radius: 3px;
		font-size: 1em;
		cursor: pointer;
	}

	.host-filter button:hover {
		color: #fff;
		background-color: #282828;
	}

	.host-filter button:active {
		background-color: #222;
	}

	.host-list {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		gap: 0.375em;
		margin-bottom: 1em;
	}

	.host-list button.include {
		background-color: var(--color-green);
	}

	.host-list button:not(.include):not(.exclude):hover {
		box-shadow: inset 0 0 10px var(--color-green);
	}

	.host-list button.exclude {
		background-color: var(--color-red);
	}

	.host-filter::after {
		content: ' ';
		display: block;
		width: 100%;
		height: 2px;
		margin-top: 6px;
		background-position: bottom;
		background-image: url(/assets/bg-border-light.png);
		background-repeat: repeat-x;
	}

	:global([data-theme='dark']) .host-filter::after {
		background-image: url(/assets/bg-border-dark.png);
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

		.host-list {
			gap: 0.5em;
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
