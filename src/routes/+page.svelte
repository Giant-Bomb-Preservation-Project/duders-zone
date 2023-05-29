<script lang="ts">
	import VideoLink from '$lib/components/VideoLink.svelte'
	import PromoLink from '$lib/components/PromoLink.svelte'
	import promoInfinite from '$lib/images/promo-gb_infinite.png'
	import promoRandom from '$lib/images/promo-random.png'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<section>
	<div>
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
		<a href="/historic">See All</a>
	</div>
	<ul>
		{#each data.historicVideos as video}
			<li>
				<VideoLink {video} href="/historic/{video.id}" />
			</li>
		{/each}
	</ul>
</section>

{#each data.shows as show}

	<section>
		<div>
			<h2>{ show.title }</h2>
			&middot;
			<a href="/shows/{ show.id }">See All</a>
		</div>
		<ul>
			{#each show.videoObjects as video}
				<li>
					<VideoLink {video} href="/shows/{ show.id }/{video.id}" />
				</li>
			{/each}
		</ul>
	</section>

{/each}
