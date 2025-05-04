<script module lang="ts">
	export enum VideosPage {
		Videos = 'Videos',
		Shows = 'Shows',
	}
</script>

<script lang="ts">
	import { base } from '$app/paths'

	interface Props {
		current: VideosPage
	}

	const { current }: Props = $props()
	const urls: { [key in VideosPage]: any } = {
		[VideosPage.Videos]: `${base}/videos`,
		[VideosPage.Shows]: `${base}/videos/shows`,
	}
</script>

<div class="container">
	<nav>
		{#each Object.entries(urls) as [page, url]}
			<a class={page == current ? 'current' : ''} href={url}>{page}</a>
		{/each}
	</nav>
</div>

<style>
	.container {
		align-items: center;
		display: flex;
		margin-bottom: 2em;
		margin-top: 2em;
		justify-content: space-between;
	}

	nav {
		display: block;
		font-family: var(--font-special);
		font-size: 21px;
		margin-left: auto;
	}

	nav a {
		color: var(--color-text);
		margin: 0 0.5em;
		padding: 0.25em 0;
	}

	nav a:hover {
		color: var(--color-red);
	}

	nav a.current {
		border-bottom: 2px solid var(--color-text);
	}
</style>
