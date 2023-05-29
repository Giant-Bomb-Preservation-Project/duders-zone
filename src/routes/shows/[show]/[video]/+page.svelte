<script lang="ts">
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoLink from '$lib/components/VideoLink.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<h1>
	{#if data.show.logo}
		<img src="/shows/{data.show.logo}" alt="{data.show.title}">
	{:else}
		{data.show.title}
	{/if}
</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section>
	<ul>
		{#each data.videos as video}
			<li>
				<VideoLink {video} href="/shows/{data.show.id}/{video.id}" />
			</li>
		{/each}
	</ul>
</section>
