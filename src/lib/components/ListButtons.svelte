<script lang="ts" generics="T">
	import Icon, { IconType } from './Icon.svelte'

	interface Props {
		value: T
		options: { label: string; option: T; icon: IconType }[]
		onChange: (option: T) => void
	}

	const { value, options, onChange }: Props = $props()
</script>

{#each options as { label, option, icon }}
	<button class:active={value === option} onclick={() => onChange(option)}>
		<Icon type={icon} />
		{label}
	</button>
{/each}

<style>
	button {
		background: none;
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		font-family: inherit;
		font-size: 14px;
		line-height: 20px;
	}

	button:hover {
		color: var(--color-red-active);
	}

	button.active {
		color: var(--color-text);
	}
</style>
