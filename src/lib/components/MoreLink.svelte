<script lang="ts">
	import FrameEmbed from '$lib/components/FrameEmbed.svelte'

	interface Props {
		children: () => any
		href: string
	}

	const { children, href }: Props = $props()
</script>

<div class="wrapper">
	<a {href}>
		{@render children()}
		<svg
			class="arrow"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 448 512"
			aria-hidden="true"
			fill="currentColor"
			><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
				d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
			/></svg
		>
	</a>
</div>

<style>
	a {
		color: var(--color-gray);
		font-size: 24px;
		font-weight: bold;
	}

	a .arrow {
		right: 0;
		transition: right 0.35s;
	}

	a:hover {
		color: var(--color-red-active);
	}

	a:hover .arrow {
		right: -0.5em;
	}

	.wrapper {
		margin: 30px 0 50px;
		text-align: center;
	}
</style>
