<script lang="ts">
	import type { Video } from '$lib/data'
	import VideoLink from '$lib/components/VideoLink.svelte'

	export let videos: Video[]
	export let title: string
	export let rootUri: string
	export let seeAllUrl: string | null = null
</script>

<div class="header-wrapper">
	<div class="header">
		<h2>{title}</h2>
		{#if seeAllUrl}
			<div class="see-all">&middot; <a href={seeAllUrl}>See All</a></div>
		{/if}
	</div>
</div>

<ul>
	{#each videos as video}
		<li>
			<a href="{rootUri}/{video.id}">
				<div class="thumbnail">
					<img src={video.thumbnail || '/shows/default.jpg'} alt="">
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

	img {
		width: 100%;
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
		color: #2c2e30;
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

	.header {
		display: flex;
	}

	.header .see-all {
		font-family: var(--font-special);
		font-size: 14px;
		line-height: 20px;
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

	.thumbnail {
		position: relative;
	}

	.thumbnail::before {
		content: " ";
		position: absolute;
		left: 50%;
		top: 50%;
		height: 0;
		float: left;
		background: url(/assets/av-splash-65x65.png) no-repeat center top;
		background-size: auto;
		width: 65px;
		padding-top: 65px;
		margin-top: -33px;
		margin-left: -33px;
		background-size: 100% auto;
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
		h2,
		.header .see-all {
			font-size: 18px;
			line-height: 20px;
		}

		ul {
			display: block;
		}

		ul a {
			display: flex;
		}

		ul li {
			background-image: url(/assets/bg-border-light.png);
		}

		.thumbnail {
			flex: 0 0 23.40426%;
			margin-right: 2.12766%;
		}
	}
</style>
