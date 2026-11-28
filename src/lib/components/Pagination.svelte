<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/state'
	import { SvelteURLSearchParams } from 'svelte/reactivity'
	interface Props {
		currentPage: number
		totalPages: number
		totalResults: number
		filtered?: boolean
	}

	const { currentPage, totalPages, totalResults, filtered }: Props = $props()

	const buttons = $derived(createPageButtons(currentPage, totalPages))

	// Creates the list of which pages should show up as buttons (with null being ... separators)
	function createPageButtons(current: number, total: number) {
		const buttons: (number | null)[] = []
		if (total === 1) return buttons

		const startPage = Math.max(1, Math.min(total - 4, current - 2))
		const endPage = Math.min(total, startPage + 4)
		for (let p = startPage; p <= endPage; p++) {
			buttons.push(p)
		}

		if (startPage > 1) {
			if (startPage - 1 > 1) buttons.unshift(null)
			buttons.unshift(1)
		}

		if (endPage < total) {
			if (endPage < total - 1) buttons.push(null)
			buttons.push(total)
		}

		return buttons
	}

	// Get searchParams for new page while preserving existing params (e.g. search query)
	function getPageLink(number: number | null) {
		if (!browser) {
			return `?page=${number}`
		}
		const params = new SvelteURLSearchParams(page.url.search)
		if (number !== null) {
			params.set('page', `${number}`)
		} else {
			params.delete('page')
		}
		return `?${params}`
	}
</script>

<ul>
	<li>
		{totalResults.toLocaleString()} video{totalResults === 1 ? '' : 's'}
		{#if totalResults === 0 && filtered}
			&mdash; try resetting your filter
		{/if}
	</li>
	{#if currentPage > 1}
		<li>
			<a href={getPageLink(currentPage - 1)} aria-label="Previous Page"
				><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 10">
					<path d="M7 5H1l3 -3M1 5l3 3" />
				</svg></a
			>
		</li>
	{/if}
	{#each buttons as button}
		{#if button}
			<li class:current={button === currentPage}>
				<a href={getPageLink(button)}>{button}</a>
			</li>
		{:else}
			<li>...</li>
		{/if}
	{/each}
	{#if currentPage < totalPages}
		<li>
			<a href={getPageLink(currentPage + 1)} aria-label="Next Page"
				><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 10">
					<path d="M1 5H7l-3 -3M7 5l-3 3" />
				</svg></a
			>
		</li>
	{/if}
</ul>

<style>
	ul {
		list-style: none;
		margin: var(--spacing) 0 calc(var(--spacing) * 2);
		padding: 0;
		display: flex;
	}

	ul li {
		color: var(--color-text-muted);
		padding: 0 3px;
		line-height: 20px;
		font-weight: bold;
	}

	ul li:first-child {
		padding-left: 0;
		font-weight: normal;
	}

	ul li a {
		color: var(--color-text-muted);
		padding: 0 6px;
		display: inline-block;
		line-height: 19px;
		border-radius: 2px;
		box-shadow:
			rgba(0, 0, 0, 0.25) 0 0 0 1px,
			rgba(255, 255, 255, 0.15) 0 1px 0 inset,
			rgba(0, 0, 0, 0.25) 0 2px 2px;
		text-shadow: rgba(255, 255, 255, 0.5) 0 1px 0;
		-webkit-background-clip: padding;
		-moz-background-clip: padding;
		background-clip: padding-box;
		background-color: #e6e6e6;
		background-image: -webkit-linear-gradient(#f5f5f5, #e6e6e600);
		background-image: -moz-linear-gradient(#f5f5f5, #e6e6e600);
		background-image: -o-linear-gradient(#f5f5f5, #e6e6e600);
		background-image: linear-gradient(#f5f5f5, #e6e6e600);
		background-repeat: repeat-x;
	}

	ul li.current a {
		box-shadow:
			#b5b5b5 0 0 0 1px,
			rgba(0, 0, 0, 0.3) 0 1px 5px inset;
	}

	ul li:not(.current) a:hover {
		color: var(--color-gray);
	}

	:global([data-theme='dark']) ul li a {
		text-shadow: rgba(0, 0, 0, 0.5) 0 1px 0;
		background-color: #303030;
		background-image: -webkit-linear-gradient(#242424, #30303000);
		background-image: -moz-linear-gradient(#242424, #30303000);
		background-image: -o-linear-gradient(#242424, #30303000);
		background-image: linear-gradient(#242424, #30303000);
	}

	:global([data-theme='dark']) ul li.current a {
		background-color: #222;
		box-shadow:
			#111 0 0 0 1px,
			rgba(0, 0, 0, 0.7) 0 1px 5px inset;
	}

	:global([data-theme='dark']) ul li:not(.current) a:hover {
		color: #ddd;
	}

	ul li a svg {
		height: 15px;
		margin: 0 -1px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
