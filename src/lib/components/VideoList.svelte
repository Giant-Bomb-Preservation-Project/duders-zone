<script context="module" lang="ts">
	export enum VideoListMode {
		List = 'list',
		Grid = 'grid',
	}
</script>

<script lang="ts">
	import type { Video } from '$lib/data'
	import Thumbnail from '$lib/components/Thumbnail.svelte'
	import VideoLink from '$lib/components/VideoLink.svelte'

	export let videos: Video[]
	export let title: string
	export let rootUri: string
	export let seeAllUrl: string | null = null
	export let mode: VideoListMode | null = null

	let currentMode = mode || VideoListMode.List

	function setCurrentMode(mode: VideoListMode) {
		console.log('MOOOOD', mode)
		currentMode = mode
	}

</script>

<div class="header-wrapper">
	<div class="header">
		<h2>{title}</h2>
		{#if seeAllUrl}
			<div class="see-all">&middot; <a href={seeAllUrl}>See All</a></div>
		{/if}
		{#if !mode}
			<div class="controls">
				<button
					class="{currentMode == VideoListMode.List ? 'active' : ''}"
					on:click={() => setCurrentMode(VideoListMode.List)}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/></svg>
					List
				</button>
				<button
					class="{currentMode == VideoListMode.Grid ? 'active' : ''}"
					on:click={() => setCurrentMode(VideoListMode.Grid)}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 96V224H288V96H448zm0 192V416H288V288H448zM224 224H64V96H224V224zM64 288H224V416H64V288zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"/></svg>
					Grid
				</button>
			</div>
		{/if}
	</div>
</div>

<ul class="{currentMode}">
	{#each videos as video}
		<li>
			<a href="{rootUri}/{video.id}">
				<div class="thumbnail">
					<Thumbnail src={video.thumbnail || '/assets/default.jpg'} alt="" />
				</div>
				<div class="metadata">
					<h3>{video.title}</h3>
					<time datetime={video.date.toISOString()}>{video.date.toLocaleDateString()}</time>
					<p>{video.description}</p>
				</div>
			</a>
		</li>
	{/each}
</ul>

<style>
	h2 {
		font-size: 14px;
		line-height: 20px;
		margin: 0;
	}

	h3 {
		font-size: 21px;
		line-height: 25px;
		margin: 10px 0 0;
	}

	time {
		display: block;
		font-family: Georgia,serif;
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
		padding: 10px 0 12px;
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
		color: var(----color-gray);
	}

	.header {
		display: flex;
		font-family: var(--font-special);
		font-size: 14px;
		line-height: 20px;
		justify-content: flex-start;
	}

	.header .see-all {
		margin-left: 0.35em;
	}

	.header-wrapper::after,
	.header-wrapper::before {
		content: " ";
		display: block;
		height: 2px;
		margin-bottom: 6px;
		background-position: bottom;
		background-image: url(/assets/bg-border-light.png);
		background-repeat: repeat-x;
	}

	.header-wrapper::after {
		margin-bottom: 0;
		margin-top: 6px;
	}

	.metadata {
		color: #696e72;
		font-size: 14px;
		line-height: 20px;
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
		h2 {
			font-size: 18px;
			line-height: 20px;
		}

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

		.header {
			font-size: 18px;
			line-height: 20px;
		}

		.thumbnail {
			flex: 0 0 23.40426%;
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
	}
</style>
