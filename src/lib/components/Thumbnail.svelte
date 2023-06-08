<script lang="ts">
	export let src: string
	export let alt: string
</script>

<div class="thumbnail">
	<img {src} {alt} />
</div>

<style>
	img {
		width: 100%;
	}

	.thumbnail {
		position: relative;
	}

	.thumbnail::before {
		content: ' ';
		position: absolute;
		left: 50%;
		top: 50%;
		height: 0;
		float: left;
		background: url(/assets/av-splash-65x65.png) no-repeat center top;
		background-size: auto;
		width: 65px;
		padding-top: 65px;
		margin-top: -33px;
		margin-left: -33px;
		background-size: 100% auto;
	}
</style>
