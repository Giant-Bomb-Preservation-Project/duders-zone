<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import PromoStrip from '$lib/components/PromoStrip.svelte'
	import Splash from '$lib/components/Splash.svelte'
	import Thumbnail from '$lib/components/Thumbnail.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import promoInfinite from '$lib/images/promo-gb_infinite.png'
	import { VideoListMode } from '$lib/types'
	import type { PageData } from './$types'
	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	const videos = data.videos
	const mainVideo = videos.pop()
</script>

<section class="splash">
	<Splash image={promoInfinite}>
		<div class="metadata">
			<h3>Giant Bomb Infinite</h3>
			<p>Watch videos from the archive, 24/7.</p>
		</div>
		<div class="link">
			<a href="https://www.giantbomb.com/infinite/">
				<Thumbnail src={promoInfinite} alt="Giant Bomb Infinite" />
			</a>
		</div>
	</Splash>
</section>

<PromoStrip {videos} />

<div class="container columns">
	<div class="left">
		<section>
			<VideoList
				videos={data.historicVideos}
				title="This Day in Giant Bomb History"
				rootUri="/historic"
				seeAllUrl="/historic"
				mode={VideoListMode.List}
			/>
		</section>
	</div>
	<aside class="right">
		<a class="infinite" href="https://www.giantbomb.com/infinite/">
			<img src={promoInfinite} alt="Giant Bomb Infinite" />
			<hgroup>
				<h3>
					Giant Bomb Infinite
					<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</h3>
				<p>Watch videos from the archive, 24/7.</p>
			</hgroup>
		</a>

		<Header title="Random Shows">
			<div class="see-all">&middot; <a href="/shows">See All</a></div>
		</Header>
		<ul id="shows">
			{#each data.shows as show}
				<li>
					<a href="/shows/{show.id}">
						<img
							src={show.poster ? `/shows/${show.poster}` : '/assets/default.jpg'}
							alt=""
						/>
						<h3>{show.title}</h3>
					</a>
				</li>
			{/each}
		</ul>
	</aside>
</div>

<style>
	h3 {
		font-size: 24px;
		margin: 0;
	}

	.columns {
		display: block;
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	.columns .left {
		flex: 2;
	}

	.columns .right {
		flex: 1;
		margin-left: var(--spacing);
	}

	.infinite {
		border: 1px solid black;
		box-shadow: rgba(0, 0, 0, 0.5) 0 2px 5px;
		color: white;
		display: block;
		margin-bottom: var(--spacing);
		position: relative;
	}

	.infinite h3 {
		text-shadow: rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	.infinite:hover h3 {
		text-shadow:
			rgba(255, 255, 255, 0.75) 0 0 10px,
			rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	.infinite hgroup {
		align-items: start;
		background: linear-gradient(
			0deg,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0) 60%,
			rgba(0, 0, 0, 0) 100%
		);
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: end;
		left: 0;
		line-height: 30px;
		margin: 0;
		padding: 1em;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;
	}

	.infinite svg {
		font-size: 12pt;
		left: -4px;
		position: relative;
		top: -4px;
	}

	.splash h3 {
		font-size: 30px;
	}

	.splash p {
		font-size: 14px;
		line-height: 20px;
		margin: 10px 0;
	}

	.splash .link {
		margin: 0;
	}

	.splash .link a {
		box-shadow: rgba(255, 255, 255, 0.1) 0 0 0 1px;
		display: block;
		line-height: 0;
	}

	#shows a {
		border: 1px solid white;
		box-shadow: rgba(0, 0, 0, 0.5) 0 2px 5px;
		color: white;
		display: block;
		position: relative;
	}

	#shows a h3 {
		text-shadow: rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	#shows a:hover h3 {
		text-shadow:
			rgba(255, 255, 255, 0.75) 0 0 10px,
			rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	#shows h3 {
		align-items: start;
		background: linear-gradient(
			0deg,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0) 60%,
			rgba(0, 0, 0, 0) 100%
		);
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: end;
		left: 0;
		line-height: 30px;
		margin: 0;
		padding: 0.5em;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;
	}

	#shows img {
		box-shadow: var(--box-shadow);
		width: 100%;
	}

	#shows li {
		margin: var(--spacing) 0;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	@media (min-width: 768px) {
		.splash h3 {
			font-size: 32px;
			line-height: 35px;
		}

		.splash p {
			font-size: 21px;
			line-height: 30px;
		}

		.splash .link {
			margin: 0 0 0 32px;
			flex: 0 0 620px;
			position: relative;
			z-index: 2;
		}

		.columns {
			display: flex;
		}

		.columns .right {
			margin-left: var(--spacing);
		}

		.metadata {
			position: relative;
			z-index: 2;
		}
	}

	@media (min-width: 1200px) {
		.splash .link {
			margin-left: 90px;
		}
	}
</style>
