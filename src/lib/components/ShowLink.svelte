<script lang="ts">
	import type { Show } from '$lib/data'

	export let show: Show

	const imageSrc = '/shows/' + (show.poster || 'default.jpg')
</script>

<a href="/shows/{show.id}">
	<img src={imageSrc} alt="">
	<strong>{show.title}</strong>
	<span class="secondary">{show.description}</span>
</a>

<style>
	a > * {
		display: block;
	}
</style>
