<script lang="ts">
	export let src: string
	export let title: string
</script>

<div class="wrapper">
	<iframe
		{src}
		{title}
		frameborder="0"
		allow="autoplay; encrypted-media; picture-in-picture; web-share"
		allowfullscreen
	></iframe>
</div>

<style>
	iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.wrapper {
		box-shadow: rgba(255, 255, 255, 0.1) 0 0 0 1px;
		position: relative;
		padding-bottom: 52.75%; /* 16:9 */
		padding-top: 25px;
		height: 0;
	}
</style>
