<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
		title: string
	}

	const { children, title }: Props = $props()
</script>

<div class="header-wrapper">
	<div class="header">
		<h2>{title}</h2>
		{@render children()}
	</div>
</div>

<style>
	h2 {
		font-size: 14px;
		line-height: 20px;
		margin: 0;
	}

	.header {
		display: flex;
		font-family: var(--font-special);
		font-size: 14px;
		line-height: 20px;
		justify-content: flex-start;
	}

	.header-wrapper::after,
	.header-wrapper::before {
		content: ' ';
		display: block;
		height: 2px;
		margin-bottom: 6px;
		background-position: bottom;
		background-image: url(/assets/bg-border-light.png);
		background-repeat: repeat-x;
	}

	.header-wrapper::after {
		margin-bottom: 0;
		margin-top: 6px;
	}

	@media (min-width: 768px) {
		h2 {
			font-size: 18px;
			line-height: 20px;
		}

		.header {
			font-size: 18px;
			line-height: 20px;
		}
	}
</style>
