<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
		handler?: () => any
		href?: string
	}

	const { children, handler, href }: Props = $props()
</script>

{#if handler}
	<button onclick={handler}>
		{@render children()}
	</button>
{:else if href}
	<a {href}>
		{@render children()}
	</a>
{:else}
	MISSING HANDLER OR HREF
{/if}

<style>
	a,
	button {
		display: inline-block;
		cursor: pointer;
		padding: 0;
		position: relative;
		border: 0;
		border-radius: 15px;
		background-color: #b31919;
		text-align: center;
		color: #fff;
		font-family: inherit;
		font-weight: bold;
		padding: 8px 24px;
		text-shadow: rgba(0, 0, 0, 0.35) 0 1px 1px;
		box-shadow:
			rgba(255, 255, 255, 0.15) 0 1px 0 inset,
			rgba(0, 0, 0, 0.35) 0 1px 3px;
		background-color: #a11717;
		background-image: linear-gradient(#c51c1c, rgba(161, 23, 23, 0));
		background-repeat: repeat-x;
		transition: all 0.15s;
	}

	a:active,
	button:active {
		color: #e33636;
		background-color: #bc1a1a;
		background-image: linear-gradient(#aa1818, rgba(188, 26, 26, 0));
		background-repeat: repeat-x;
	}

	a::before,
	button::before {
		content: '';
		position: absolute;
		top: -5px;
		left: -5px;
		right: -5px;
		bottom: -5px;
		z-index: -1;
		border-radius: 18px;
		background-color: #fcfcfd;
		box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px inset;
		background-color: #fcfcfd;
		background-image: linear-gradient(#e7e8e9, rgba(252, 252, 253, 0));
		background-repeat: repeat-x;
	}
</style>
