<script context="module" lang="ts">
	const PAGE_SIZE = 50

	export function paginate<T extends any[]>(pageParam: string | null, items: T) {
		const number = pageParam ? parseInt(pageParam) : 1
		const itemIndexStart = (number - 1) * PAGE_SIZE
		return {
			number,
			items: items.slice(itemIndexStart, itemIndexStart + PAGE_SIZE) as T,
		}
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation'

	export let currentPage: number = 1
	export let totalResults: number

	$: totalPages = Math.ceil(totalResults / PAGE_SIZE)
	$: buttons = createPageButtons(currentPage, totalPages)

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
</script>

<ul>
	<li>{totalResults} results</li>
	{#if currentPage > 1}
		<li>
			<a
				on:click|preventDefault={() => goto(`?page=${currentPage - 1}`)}
				href="?page={currentPage - 1}"
				><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 10">
					<path d="M7 5H1l3 -3M1 5l3 3" />
				</svg></a
			>
		</li>
	{/if}
	{#each buttons as button}
		{#if button}
			<li class:current={button === currentPage}>
				<a on:click|preventDefault={() => goto(`?page=${button}`)} href="?page={button}"
					>{button}</a
				>
			</li>
		{:else}
			<li class="ellipse">...</li>
		{/if}
	{/each}
	{#if currentPage < totalPages}
		<li>
			<a
				on:click|preventDefault={() => goto(`?page=${currentPage + 1}`)}
				href="?page={currentPage + 1}"
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
		margin: 0;
		padding: 0;
		margin-top: var(--spacing);
		display: flex;
	}

	ul li {
		color: #9da1a4;
		padding: 0 3px;
		line-height: 20px;
		font-weight: bold;
	}

	ul li:first-child {
		padding-left: 0;
		color: #696e72;
		font-weight: normal;
	}

	ul li a {
		color: #696e72;
		padding: 0 6px;
		display: inline-block;
		line-height: 19px;
		border-radius: 2px;
		box-shadow: rgba(0, 0, 0, 0.25) 0 0 0 1px, rgba(255, 255, 255, 0.15) 0 1px 0 inset,
			rgba(0, 0, 0, 0.25) 0 2px 2px;
		text-shadow: rgba(255, 255, 255, 0.5) 0 1px 0;
		-webkit-background-clip: padding;
		-moz-background-clip: padding;
		background-clip: padding-box;
		background-color: #e6e6e6;
		background-image: -webkit-linear-gradient(#f5f5f5, rgba(230, 230, 230, 0));
		background-image: -moz-linear-gradient(#f5f5f5, rgba(230, 230, 230, 0));
		background-image: -o-linear-gradient(#f5f5f5, rgba(230, 230, 230, 0));
		background-image: linear-gradient(#f5f5f5, rgba(230, 230, 230, 0));
		background-repeat: repeat-x;
	}

	ul li.current a {
		box-shadow: #b5b5b5 0 0 0 1px, rgba(255, 255, 255, 0.15) 0 1px 0 inset,
			rgba(0, 0, 0, 0.3) 0 1px 5px inset, #fff 0 2px 0;
	}

	ul li:not(.current) a:hover {
		color: var(--color-gray);
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
