<script lang="ts">
	import VideoLink from '$lib/components/VideoLink.svelte'
	import { quickLookVideos, thisDayVideos } from '$lib/data'
	import type { Video } from '$lib/data'
</script>

<section class="grid">
	<div>
		<a href="/infinite">
			<h2>Giant Bomb Infinite</h2>
			<p>Watch videos from the archive, 24/7.</p>
		</a>
	</div>
	<div>
		<a href="/random">
			<h2>Random</h2>
			<p>Watch a random video from the archive.</p>
		</a>
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
		padding: 0;
	}

	li {
		list-style: none;
	}
</style>
