<script lang="ts">
	import type { Video } from '$lib/data'
	import { VideoListMode } from '$lib/types'
	import Header from '$lib/components/Header.svelte'
	import Thumbnail from '$lib/components/Thumbnail.svelte'
	import { videoListMode } from '$lib/store.js'

	interface Props {
		videos: Video[]
		title: string
		rootUri?: string
		seeAllUrl?: string
		mode?: VideoListMode
		linkSuffix?: string
	}

	const { videos, title, rootUri, seeAllUrl, mode, linkSuffix = '' }: Props = $props()
</script>

<Header {title}>
	{#if seeAllUrl}
		<div class="see-all">&middot; <a href={seeAllUrl}>See All</a></div>
	{/if}
	{#if !mode}
		<div class="controls">
			<button
				class={$videoListMode == VideoListMode.List ? 'active' : ''}
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
				class={$videoListMode == VideoListMode.Grid ? 'active' : ''}
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
		</div>
	{/if}
</Header>

<ul class={mode ?? $videoListMode}>
	{#each videos as video}
		<li>
			<a href="{rootUri || `/shows/${video.show}`}/{video.id}{linkSuffix}">
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

<style>
	h3 {
		font-size: 21px;
		line-height: 25px;
		margin: 10px 0 0;
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
		color: var(--color-gray);
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

	ul li:last-child {
		background-image: none;
	}

	.controls {
		display: none;
	}

	.controls button {
		background: none;
		border: none;
		color: var(--color-red-active);
		cursor: pointer;
		font-family: inherit;
		font-size: 14px;
		line-height: 20px;
	}

	.controls button.active,
	.controls button:hover {
		color: var(--color-gray);
	}

	.metadata {
		color: var(--color-gray-muted);
		font-size: 14px;
		line-height: 20px;
	}

	.metadata h3 {
		color: var(--color-gray);
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

		ul li {
			background-image: none;
		}
	}

	@media (min-width: 768px) {
		ul:not(.grid) {
			display: block;
		}

		ul:not(.grid) a {
			display: flex;
		}

		ul:not(.grid) li {
			background-image: url(/assets/bg-border-light.png);
		}

		ul li:last-child {
			background-image: none;
		}

		.controls {
			display: block;
			margin-left: auto;
		}

		.thumbnail {
			flex: 0 0 220px;
			margin-right: 2.12766%;
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
