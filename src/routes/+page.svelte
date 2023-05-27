<script lang="ts">
	import VideoLink from '$lib/components/VideoLink.svelte'
	import { getVideosForDay, getVideosForShow } from '$lib/data'
	import promoInfinite from '$lib/images/promo-gb_infinite.png'
	import promoRandom from '$lib/images/promo-random.png'
	import PromoLink from './PromoLink.svelte'
	import type { Video } from '$lib/data'

	function pickNRandomVideos(videos: Video[], n: number): Video[] {
		const shuffled = videos.sort(() => 0.5 - Math.random())
		return shuffled.slice(0, n)
	}

	const quickLookVideos = pickNRandomVideos(getVideosForShow('quick-looks'), 5)
	const thisDayVideos = pickNRandomVideos(getVideosForDay(), 5)
</script>

<section>
	<div class="grid">
		<PromoLink
			href="/infinite"
			title="Giant Bomb Infinite"
			description="Watch videos from the archive, 24/7."
			image={promoInfinite}
		/>
		<PromoLink
			href="/random"
			title="Random"
			description="Watch a random video from the archive."
			image={promoRandom}
		/>
	</div>
</section>

<section>
	<div>
		<h2>This Day in Giant Bomb History</h2>
		&middot;
		<a href="/TODO">See All</a>
	</div>
	<ul class="grid">
		{#each thisDayVideos as video}
			<li>
				<VideoLink {video} href="/historic/today/{video.id}" />
			</li>
		{/each}
	</ul>
</section>

<section>
	<div>
		<h2>Quick Looks</h2>
		&middot;
		<a href="/TODO">See All</a>
	</div>
	<ul class="grid">
		{#each quickLookVideos as video}
			<li>
				<VideoLink {video} href="/shows/quick-looks/{video.id}" />
			</li>
		{/each}
	</ul>
</section>

<style>
	h2 {
		display: inline;
		font-size: 1.25rem;
		margin: 0;
	}

	ul {
		margin-top: 1em;
		padding: 0;
	}

	li {
		list-style: none;
	}
</style>
