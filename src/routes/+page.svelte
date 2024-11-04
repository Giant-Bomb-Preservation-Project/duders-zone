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

<section>
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
		<Header title="Random Shows">
			<div class="see-all">&middot; <a href="/shows">See All</a></div>
		</Header>
		<ul class="shows">
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
		font-size: 30px;
		margin: 0;
	}

	p {
		font-size: 14px;
		line-height: 20px;
		margin: 10px 0;
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

	.link {
		margin: 0;
	}

	.link a {
		box-shadow: rgba(255, 255, 255, 0.1) 0 0 0 1px;
		display: block;
		line-height: 0;
	}

	.shows a {
		color: white;
		display: block;
		position: relative;
	}

	.shows a h3 {
		font-size: 24px;
		text-shadow: rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	.shows a:hover h3 {
		text-shadow:
			rgba(255, 255, 255, 0.75) 0 0 10px,
			rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	.shows h3 {
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

	.shows img {
		box-shadow: var(--box-shadow);
		width: 100%;
	}

	.shows li {
		margin: var(--spacing) 0;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	@media (min-width: 768px) {
		h3 {
			font-size: 32px;
			line-height: 35px;
		}

		p {
			font-size: 21px;
			line-height: 30px;
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

		.link {
			margin: 0 0 0 32px;
			flex: 0 0 620px;
			position: relative;
			z-index: 2;
		}
	}

	@media (min-width: 1200px) {
		.link {
			margin-left: 90px;
		}
	}
</style>
