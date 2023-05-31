<script lang="ts">
	import MoreLink from '$lib/components/MoreLink.svelte'
	import Splash from '$lib/components/Splash.svelte'
	import Thumbnail from '$lib/components/Thumbnail.svelte'
	import VideoList, { VideoListMode } from '$lib/components/VideoList.svelte'
	import promoInfinite from '$lib/images/promo-gb_infinite.png'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<section>
	<Splash image={promoInfinite}>
		<div class="metadata">
			<h3>Giant Bomb Infinite</h3>
			<p>Watch videos from the archive, 24/7.</p>
		</div>
		<div class="link">
			<a href="/infinite">
				<Thumbnail src={promoInfinite} alt="Giant Bomb Infinite" />
			</a>
		</div>
	</Splash>
</section>

<section class="container videos">
	<VideoList
		videos={data.historicVideos}
		title="This Day in Giant Bomb History"
		rootUri="/historic"
		seeAllUrl="/historic"
		mode={VideoListMode.List}
	/>
</section>

{#each data.shows as show}

<section class="container videos">
	<VideoList
		videos={show.videoObjects}
		title="{ show.title }"
		rootUri="/shows/{ show.id }"
		seeAllUrl="/shows/{ show.id }"
		mode={VideoListMode.List}
	/>
</section>

{/each}

<MoreLink href="/shows">
	More Shows
</MoreLink>


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

	.link {
		margin: var(--spacing) 0;
	}

	.link a {
		box-shadow: rgba(255,255,255,0.1) 0 0 0 1px;
		display: block;
		line-height: 0;
	}

	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	@media (min-width: 992px) {
		h3 {
			font-size: 32px;
			line-height: 35px;
		}

		p {
			font-size: 21px;
			line-height: 30px;
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
