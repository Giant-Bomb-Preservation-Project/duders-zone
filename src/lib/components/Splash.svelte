<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
		image: string
	}

	const { children, image }: Props = $props()
</script>

<div class="wrapper">
	<div class="container">
		<div class="inner-container">
			<div class="splash" style="background-image: url('{image}');"></div>
			{@render children()}
		</div>
	</div>
</div>

<style>
	.splash {
		display: none;
	}

	.wrapper {
		background: black;
		color: white;
		font-family: var(--font-special);
		padding: 16px 0;
	}

	@media (min-width: 992px) {
		.inner-container {
			display: flex;
			padding: 24px 0 64px;
			overflow: hidden;
			position: relative;
		}

		.splash {
			background: black center center no-repeat;
			background-size: cover;
			display: block;
			filter: blur(10px);
			height: 100%;
			opacity: 0.5;
			position: absolute;
			width: 100%;
			top: 0;
			z-index: 1;
		}

		.splash::after {
			content: ' ';
			width: 400px;
			height: 100%;
			background: url(/assets/bg-kubrick-fade-left.png) left top repeat-y;
			display: block;
			top: 0;
			left: 0;
			position: absolute;
		}

		.splash::before {
			content: ' ';
			width: 400px;
			height: 100%;
			background: url(/assets/bg-kubrick-fade-right.png) right top repeat-y;
			display: block;
			top: 0;
			right: 0;
			position: absolute;
		}

		.wrapper {
			padding: 0;
			text-shadow: rgba(0, 0, 0, 0.9) 0 1px 0;
		}
	}
</style>
