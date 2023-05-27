<script lang="ts">
	export let src: string
	export let title: string
</script>

<div id="wrapper">
	<iframe
		{src}
		{title}
		frameborder="0"
		webkitallowfullscreen="true"
		mozallowfullscreen="true"
		allowfullscreen>
	</iframe>
</div>

<style>
	#wrapper {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 */
		padding-top: 25px;
		height: 0;
	}

	#wrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
