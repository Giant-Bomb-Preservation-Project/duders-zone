<script lang="ts">
	import { browser } from '$app/environment'
	import { theme } from '$lib/store'
	import { Theme } from '$lib/types'

	function setTheme(themeType: Theme) {
		theme.set(themeType)

		if (browser) {
			document.documentElement.setAttribute('data-theme', themeType)
		}
	}
</script>

<div class="buttons">
	<button aria-label="Toggle light mode" class="light" onclick={() => setTheme(Theme.Light)}
		>A</button
	>
	<button aria-label="Toggle dark mode" class="dark" onclick={() => setTheme(Theme.Dark)}
		>A</button
	>
</div>

<style>
	button {
		border: 0;
		cursor: pointer;
		display: block;
		flex: 0;
		line-height: 16px;
		padding: 0 5px;
	}

	.buttons {
		border-radius: 4px;
		box-shadow: black 0 0 0 1px;
		display: flex;
		overflow: hidden;
	}

	.dark {
		background: var(--color-gray);
		color: #eee;
	}

	.light {
		background: #e6e6e6;
		color: #222;
	}
</style>
