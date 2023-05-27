<script>
	import '@picocss/pico';
</script>

<header>
	<nav class="container">
		<ul>
			<li>
				<a href="/" class="contrast"><strong>duders.zone</strong></a>
			</li>
			<li>
				<a href="/shows" class="contrast">Shows</a>
			</li>
			<li>
				<a href="/infinite" class="contrast">Infinite</a>
			</li>
			<li>
				<a href="/random" class="contrast">Random</a>
			</li>
			<li>
				<a href="/about" class="contrast">About</a>
			</li>
		</ul>
	</nav>
</header>

<main class="container">
	<slot />
</main>

<footer>
	<div class="container">
		TODO
	</div>
</footer>

<style>
	footer {
		background-color: var(--secondary);
		box-shadow: 0 50vh 0 50vh var(--secondary);
	}

	header {
		background-color: var(--secondary);
		padding: 0;
	}
</style>
