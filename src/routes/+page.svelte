<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '$lib/components/Button.svelte'
	import Header from '$lib/components/Header.svelte'
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte'
	import PromoStrip from '$lib/components/PromoStrip.svelte'
	import Splash from '$lib/components/Splash.svelte'
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import { dataStore } from '$lib/data'
	import promoInfinite from '$lib/images/promo-gb_infinite.png'
	import { dateToText } from '$lib/text'
	import { VideoListMode } from '$lib/types'
	import type { Show, Video } from '$lib/data'

	function pickNRandomVideos(videos: Video[], n: number): Video[] {
		const shuffled = videos.sort(() => 0.5 - Math.random())
		return shuffled.slice(0, n)
	}

	const historicUri = '/historic/' + dateToText(new Date())
	var loading: boolean = $state(true)
	var shows: Show[] = $state([])
	var randomVideos: Video[] = $state([])
	var historicVideos: Video[] = $state([])
	var mainVideo: Video | null = $state(null)

	onMount(() => {
		loading = false
		shows = dataStore.getRandomShows(4)
		randomVideos = dataStore.getRandomVideos(4)
		historicVideos = pickNRandomVideos(dataStore.getVideosForDay(), 6)
		mainVideo = randomVideos.pop() as Video
	})
</script>

{#if loading}
	<LoadingIndicator />
{:else}
	{#if mainVideo}
		<VideoEmbed video={mainVideo} />
	{/if}

	<PromoStrip videos={randomVideos} />

	<div class="container columns">
		<div class="left">
			<VideoList
				videos={historicVideos}
				title="This Day in Giant Bomb History"
				rootUri={historicUri}
				seeAllUrl="/historic"
				mode={VideoListMode.List}
			/>

			<div class="more">
				<Button href="/historic">
					<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M6.5 6.5V2C6.5 1.17157 7.1716 0.5 8 0.5C8.8284 0.5 9.5 1.17157 9.5 2V6.5H14C14.8284 6.5 15.5 7.1716 15.5 8C15.5 8.8284 14.8284 9.5 14 9.5H9.5V14C9.5 14.8284 8.8284 15.5 8 15.5C7.1716 15.5 6.5 14.8284 6.5 14V9.5H2C1.17157 9.5 0.5 8.8284 0.5 8C0.5 7.1716 1.17157 6.5 2 6.5H6.5z"
							fill="currentColor"
						/>
					</svg>
					Show me more
				</Button>
			</div>
		</div>
		<aside class="right">
			<a class="infinite" href="https://www.twitch.tv/giantbombforever">
				<img src={promoInfinite} alt="Giant Bomb Forever" />
				<hgroup>
					<h3>
						Giant Bomb Forever
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

			<Header title="Some Random Shows">
				<div class="see-all">&middot; <a href="/shows">See All</a></div>
			</Header>
			<ul class="shows">
				{#each shows as show}
					<li>
						<a href="/shows/{show.id}">
							<img
								src={show.poster
									? `/assets/shows/${show.poster}`
									: '/assets/default.jpg'}
								alt=""
							/>
							<h3>{show.title}</h3>
						</a>
					</li>
				{/each}
			</ul>
		</aside>
	</div>
{/if}

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
		transition: text-shadow 0.25s;
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

	.more {
		margin: 2em 0;
		text-align: center;
	}

	.more svg {
		margin-right: 0.5em;
	}

	.shows a {
		border: 1px solid white;
		box-shadow: rgba(0, 0, 0, 0.5) 0 2px 5px;
		color: white;
		display: block;
		position: relative;
	}

	.shows a h3 {
		text-shadow: rgba(0, 0, 0, 0.75) 0 1px 1px;
		transition: text-shadow 0.25s;
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
		.columns {
			display: flex;
		}

		.columns .right {
			margin-left: var(--spacing);
		}
	}
</style>
