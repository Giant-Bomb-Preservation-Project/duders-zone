<script lang="ts">
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>


<h1 class="sr-only">Historic</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section class="container videos">
	<VideoList videos={data.videos} title="This Day in Giant Bomb History" rootUri="/historic" />
</section>


<style>
	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}
</style>
