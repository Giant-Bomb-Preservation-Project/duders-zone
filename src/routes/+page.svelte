<script lang="ts">
	import Header from '$lib/components/Header.svelte'
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

<section class="promo-strip">
	<ul class="videos">
		{#each data.videos as video}
			<li style="background-image: url('{video.thumbnail || '/assets/default.jpg'}');">
				<a href={`/shows/${video.show}/${video.id}`}>
					<hgroup>
						<span>
							Video
							<svg
								viewBox="6 8 12 10"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" />
							</svg>
						</span>
						<h3>{video.title}</h3>
					</hgroup>
				</a>
			</li>
		{/each}
	</ul>
</section>

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
						<hgroup>
							<h3>{show.title}</h3>
						</hgroup>
					</a>
				</li>
			{/each}
		</ul>
	</aside>
</div>

<style>
	a hgroup h3 {
		font-size: 24px;
		text-shadow: rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	a:hover hgroup h3 {
		text-shadow:
			rgba(255, 255, 255, 0.75) 0 0 10px,
			rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	h3 {
		font-size: 30px;
		margin: 0;
	}

	hgroup {
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
	}

	hgroup h3 {
		z-index: 1;
	}

	hgroup span {
		background: var(--color-red);
		color: #fff;
		display: block;
		font-family: 'Helvetica Neue', 'HelveticaNeue', Arial, sans-serif;
		font-size: 10px;
		line-height: 15px;
		font-weight: 600;
		text-transform: uppercase;
		margin: 0 0 0.25em;
		padding: 0 5px;
		box-shadow:
			rgba(255, 255, 255, 0.1) 0 1px 0 inset,
			rgba(0, 0, 0, 0.35) 0 1px 2px;
		border-radius: 4px;
		z-index: 1;
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

	.promo-strip {
		background: black;
		border-top: 1px solid black;
		position: relative;
	}

	.promo-strip a {
		height: 180px;
	}

	.promo-strip li {
		background: none center center no-repeat;
		background-size: cover;
		flex: 1;
		position: relative;
	}

	.promo-strip a,
	.shows a {
		color: white;
		display: block;
		position: relative;
	}

	.promo-strip::after {
		background: rgba(255, 255, 255, 0.15);
		content: ' ';
		display: block;
		height: 1px;
		position: absolute;
		top: 0;
		width: 100%;
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

		.promo-strip a {
			height: 250px;
		}

		.promo-strip li {
			box-shadow:
				rgba(0, 0, 0, 0.75) -1px 0 0 inset,
				rgba(255, 255, 255, 0.2) 1px 0 0 inset;
		}

		.promo-strip li:first-child {
			box-shadow: rgba(0, 0, 0, 0.75) -1px 0 0 inset;
		}

		.promo-strip li:last-child {
			box-shadow: rgba(255, 255, 255, 0.2) 1px 0 0 inset;
		}

		.promo-strip li:first-child a::after,
		.promo-strip li:last-child a::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			bottom: 0;
		}

		.promo-strip li:first-child a::after {
			background: linear-gradient(
				90deg,
				rgba(0, 0, 0, 1) 0%,
				rgba(0, 0, 0, 0) 60%,
				rgba(0, 0, 0, 0) 100%
			);
		}

		.promo-strip li:last-child a::after {
			background: linear-gradient(
				270deg,
				rgba(0, 0, 0, 1) 0%,
				rgba(0, 0, 0, 0) 60%,
				rgba(0, 0, 0, 0) 100%
			);
		}

		.promo-strip ul {
			display: flex;
		}
	}

	@media (min-width: 992px) {
		.videos {
			max-width: 920px;
			margin-left: auto;
			margin-right: auto;
		}
	}

	@media (min-width: 1200px) {
		.link {
			margin-left: 90px;
		}

		.videos {
			max-width: 1130px;
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
