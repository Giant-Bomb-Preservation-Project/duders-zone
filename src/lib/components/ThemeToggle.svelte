<script lang="ts">
	import { browser } from '$app/environment'
	import { theme } from '$lib/store'
	import { Theme } from '$lib/types'

	let darkMode = $derived($theme === Theme.Dark)

	$effect(() => {
		const themeType = darkMode ? Theme.Dark : Theme.Light
		theme.set(themeType)
		if (browser) {
			document.documentElement.setAttribute('data-theme', themeType)
		}
	})
</script>

<label class="switch" class:dark={darkMode}>
	<input type="checkbox" bind:checked={darkMode} />
	<span class="modes"></span>
	<span class="sr-only">Dark mode</span>
</label>

<style>
	.switch {
		position: relative;
		display: block;
		width: 50px;
		height: 24px;
		background-color: #333;
		border-radius: 4px;
		box-shadow: #000 0 0 0 1px;
		overflow: hidden;
		box-sizing: border-box;
	}

	.switch.dark {
		background-color: #222;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.modes {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.modes::before,
	.modes::after {
		display: flex;
		position: absolute;
		content: 'A';
		height: 100%;
		width: 50%;
		align-items: center;
		justify-content: center;
		font-size: 1.25em;
	}

	.modes::before {
		background-color: #eee;
		color: #000;
	}

	.dark .modes::before {
		background-color: #666;
		color: #1118;
	}

	.modes::after {
		right: 0;
		color: #666;
	}

	.dark .modes::after {
		color: #fff;
	}
</style>
