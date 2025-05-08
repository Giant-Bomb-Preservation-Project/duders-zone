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
</style>
