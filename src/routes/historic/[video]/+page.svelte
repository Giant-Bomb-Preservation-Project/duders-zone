<script lang="ts">
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoLink from '$lib/components/VideoLink.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<h1>
	Historic
</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section>
	<ul>
		{#each data.videos as video}
			<li>
				<VideoLink {video} href="/historic/{video.id}" />
			</li>
		{/each}
	</ul>
</section>
