<script lang="ts">
	import type { Person, Video } from '$lib/data'

	interface Props {
		videos: Video[]
		filteredVideos: Video[]
		hosts: Person[]
		hidden: boolean
	}

	let { videos, hosts, filteredVideos = $bindable(), hidden }: Props = $props()

	enum HostFilter {
		neutral,
		include,
		exclude,
	}
	// svelte-ignore state_referenced_locally
	let hostFilters = $state(hosts.map(() => HostFilter.neutral))
	let includeHosts = $derived(hosts.filter((_, h) => hostFilters[h] === HostFilter.include))
	let excludeHosts = $derived(hosts.filter((_, h) => hostFilters[h] === HostFilter.exclude))
	let filterActive = $derived(includeHosts.length + excludeHosts.length > 0)
	let matchAnyIncludedHost = $state(false)
	$effect(() => {
		filteredVideos = filterActive
			? videos.filter((v) =>
					matchAnyIncludedHost
						? includeHosts.some((ih) => v.hosts.find((h) => h.id === ih.id))
						: includeHosts.every((ih) => v.hosts.find((h) => h.id === ih.id)) &&
							excludeHosts.every((eh) => !v.hosts.find((h) => h.id === eh.id))
				)
			: videos
	})
</script>

{#if !hidden}
	<div class="host-filter">
		<h2>Filter by hosts</h2>
		{#if filterActive}
			<button onclick={() => (hostFilters = hosts.map(() => HostFilter.neutral))}>
				Reset
			</button>
		{/if}
		<div class="host-list">
			{#each hosts as host, h}
				{@const include = hostFilters[h] === HostFilter.include}
				{@const exclude = hostFilters[h] === HostFilter.exclude}
				<button
					class:include
					class:exclude
					title="{include ? 'Exclude' : exclude ? 'Reset' : 'Include'} {host.name}"
					onclick={() => (hostFilters[h] = (hostFilters[h] + 1) % 3)}>{host.name}</button
				>
			{/each}
		</div>
		<div style="display: flex; flex-direction: column;">
			<label>
				<input type="checkbox" bind:checked={matchAnyIncludedHost} />
				Include videos with any of these hosts
			</label>
		</div>
	</div>
{/if}

<style>
	h2 {
		font-size: 16px;
	}

	.host-filter {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 1em;
		width: 100%;
	}

	.host-filter button {
		height: 32px;
		font-weight: bold;
		background: var(--color-gray) url(/assets/bg-button.png) center center repeat-x;
		color: #dedede;
		text-shadow: rgba(0, 0, 0, 0.5) 0 1px 0;
		padding: 0 1em;
		border: 1px solid #0b0d0e;
		border-radius: 3px;
		font-size: 1em;
		cursor: pointer;
	}

	.host-filter button:hover {
		color: #fff;
		background-color: #282828;
	}

	.host-filter button:active {
		background-color: #222;
	}

	.host-list {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
		gap: 0.375em;
		margin-bottom: 1em;
	}

	.host-list button.include {
		background-color: var(--color-green);
	}

	.host-list button:not(.include):not(.exclude):hover {
		box-shadow: inset 0 0 10px var(--color-green);
	}

	.host-list button.exclude {
		background-color: var(--color-red);
	}

	.host-filter::after {
		content: ' ';
		display: block;
		width: 100%;
		height: 2px;
		margin-top: 6px;
		background-position: bottom;
		background-image: url(/assets/bg-border-light.png);
		background-repeat: repeat-x;
	}

	:global([data-theme='dark']) .host-filter::after {
		background-image: url(/assets/bg-border-dark.png);
	}

	@media (min-width: 768px) {
		.host-list {
			gap: 0.5em;
		}
	}
</style>
