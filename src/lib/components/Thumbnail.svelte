<script lang="ts">
	interface Props {
		src: string
		alt?: string
	}

	const { src, alt }: Props = $props()
</script>

<div class="thumbnail">
	<img {src} {alt} />
</div>

<style>
	img {
		width: 100%;
	}

	.thumbnail {
		aspect-ratio: 16/9;
		background: url(/assets/no-thumbnail.jpg) no-repeat center center;
		background-size: cover;
		overflow: hidden;
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
