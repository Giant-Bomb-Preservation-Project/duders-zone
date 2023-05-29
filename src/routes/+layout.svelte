<script>
	import '../app.css'
	import logo from '$lib/images/logo-og.png'

</script>

<header>
	<div class="container">
		<div id="top-header">
			<h1 id="brand">
				<a href="/"><img src="{logo}" alt="duders.zone"></a>
			</h1>
			<a id="andre" class="border" href="https://www.giantbomb.com/infinite/">
				Giant Bomb Infinite
				<span>Hang out and watch Giant Bomb Videos FOREVER!</span>
			</a>
		</div>
	</div>
	<nav>
		<div class="container">
			<ul>
				<li>
					<a href="/shows">Shows</a>
				</li>
				<li>
					<a href="/infinite">Infinite</a>
				</li>
				<li>
					<a href="/historic">Historic</a>
				</li>
				<li>
					<a href="/random">Random</a>
				</li>
				<li>
					<a href="/alumni">Alumni</a>
				</li>
			</ul>
		</div>
	</nav>
</header>

<main>
	<slot />
</main>

<footer>
	<div>
		TODO
	</div>
</footer>

<style>
	header {
		background: #242629;
		background-image: url(/assets/bg-noise-white.png), linear-gradient(#242629, #414549);
		color: #ccc;
	}

	nav {
		border-top: solid 1px #070808;
		background: #2b2e31 url(/assets/bg-noise-white.png);
		box-shadow: #373b3f 0 1px 0 inset;
		font-family: var(--font-special);
		font-size: 14px;
	}

	nav a {
		color: white;
		display: block;
		line-height: 40px;
		text-align: center;
		text-shadow: rgba(0, 0, 0, 0.5) 0 -1px 0;
	}

	nav a:hover {
		background: #b31919 url(/assets/bg-navsubhover.png) repeat-x;
	}

	nav ul {
		border-left: solid 1px #070808;
		border-right: solid 1px #373b3f;
		display: flex;
		flex-direction: row;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	nav ul li {
		border-right: solid 1px #070808;
		border-left: solid 1px #373b3f;
		flex: 1 1 auto;
	}

	nav::after {
		content: " ";
		display: block;
		height: 1px;
		width: 100%;
		background: #861313;
		border-top: 1px solid #b31919;
		border-bottom: 1px solid #590d0d;
		box-shadow: rgba(255,255,255,0.15) 0 1px 0;
	}

	#andre {
		background: transparent url(/assets/icn-andre-48x240.png) 0 0 no-repeat;
		background-position: 0 0;
		background-size: 24px auto;
		color: #fe0;
		font-family: var(--font-special);
		font-size: 13px;
		height: 40px;
		padding-left: 30px;
		text-shadow: rgba(0,0,0,0.5) 0 1px 0;
		width: 152px;
	}

	#andre span {
		color: white;
		display: block;
	}

	#andre:hover {
		background-position: 0 -70px;
		text-shadow: #fff 0 0 5px;
	}

	#brand {
		padding-top: 10px;
	}

	#brand img {
		max-width: 120px;
	}

	#top-header {
		align-items: center;
		display: flex;
		flex-direction: row;
	}

	.border {
		margin-left: 45px;
		position: relative;
	}

	.border::before {
		border-left: 1px solid rgba(0,0,0,0.3);
		box-shadow: 1px 0 0 rgba(255,255,255,0.08);
		content: "";
		display: block;
		height: 30px;
		margin: -15px 0 0 -22.5px;
		left: 0;
		position: absolute;
		top: 50%;
		width: 0;
	}
</style>
