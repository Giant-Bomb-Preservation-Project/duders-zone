<script>
	import { page } from '$app/stores'
	import logo from '$lib/images/logo-dz.png'
	import internetArchive from '$lib/images/internet-archive.jpg'
	import giantBombPreservationSociety from '$lib/images/giant-bomb-preservation-society.png'
	import '../app.css'

	const menu = [
		{ path: '/shows', text: 'Shows' },
		{ path: '/historic', text: 'Historic' },
		{ path: '/search', text: 'Search' },
		{ path: '/random', text: 'Random' },
		{ path: '/alumni', text: 'Alumni' },
	]
</script>

<div id="site-container">
	<header>
		<div class="container">
			<div id="top-header">
				<h1 id="brand">
					<a href="/"><img src={logo} alt="duders.zone" /></a>
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
					{#each menu as { path, text }}
						<li>
							<a class={$page.route.id?.startsWith(path) ? 'active' : ''} href={path}
								>{text}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</nav>
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<div class="container">
			<p id="thanks">
				This is an archival website about video games. It was made possible thanks to:
			</p>
			<div id="credits">
				<div>
					<a href="https://archive.org"
						><img src={internetArchive} alt="Internet Archive" /></a
					>
					<h3>Internet Archive</h3>
					<p>
						If possible, consider <a href="https://archive.org/donate">donating</a> to keep
						the project alive.
					</p>
				</div>
				<div>
					<a href="https://discord.gg/8zJKsAyVPT"
						><img
							src={giantBombPreservationSociety}
							alt="Giant Bomb Preservation Society"
						/></a
					>
					<h3>Giant Bomb Preservation Society</h3>
					<p>
						Join <a href="https://discord.gg/8zJKsAyVPT">the Discord server</a> to know more.
					</p>
				</div>
			</div>
			<p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 32 32"
					fill="currentColor"
					preserveAspectRatio="xMidYMid meet"
					aria-hidden="true"
					focusable="false"
					><path
						fill-rule="evenodd"
						d="M16,2a14,14,0,0,0-4.43,27.28c.7.13,1-.3,1-.67s0-1.21,0-2.38c-3.89.84-4.71-1.88-4.71-1.88A3.71,3.71,0,0,0,6.24,22.3c-1.27-.86.1-.85.1-.85A2.94,2.94,0,0,1,8.48,22.9a3,3,0,0,0,4.08,1.16,2.93,2.93,0,0,1,.88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4,5.4,0,0,1,1.44-3.76,5,5,0,0,1,.14-3.7s1.17-.38,3.85,1.43a13.3,13.3,0,0,1,7,0c2.67-1.81,3.84-1.43,3.84-1.43a5,5,0,0,1,.14,3.7,5.4,5.4,0,0,1,1.44,3.76c0,5.38-3.27,6.56-6.39,6.91a3.33,3.33,0,0,1,.95,2.59c0,1.87,0,3.38,0,3.84s.25.81,1,.67A14,14,0,0,0,16,2Z"
					/></svg
				>
				This site is
				<a href="https://github.com/Giant-Bomb-Preservation-Project/duders-zone"
					>open source</a
				>.
			</p>
		</div>
	</footer>
</div>

<style>
	footer {
		background: #242629 url(/assets/bg-noise-white.png);
		color: gray;
		padding: 3em 0 5em;
		position: relative;
		text-align: center;
		padding-bottom: 50vh;
		margin-bottom: -50vh;
	}

	footer a {
		color: white;
	}

	footer a:hover {
		color: var(--color-red);
	}

	footer p {
		margin-bottom: 3em;
	}

	footer::before {
		content: ' ';
		display: block;
		height: 1px;
		width: 100%;
		background: #861313;
		border-top: 1px solid var(--color-red);
		border-bottom: 1px solid #590d0d;
		box-shadow: rgba(255, 255, 255, 0.15) 0 1px 0;
		position: absolute;
		top: 0;
	}

	footer #credits {
		margin-bottom: 1em;
	}

	footer #credits img {
		max-width: 200px;
	}

	header {
		background: #242629;
		background-image: url(/assets/bg-noise-white.png), linear-gradient(#242629, #414549);
		color: #ccc;
	}

	header h1 {
		margin: 0;
	}

	header #andre span {
		color: white;
		display: block;
	}

	header #andre:hover {
		background-position: 0 -70px;
		text-shadow: #fff 0 0 5px;
	}

	header #brand {
		padding-top: 10px;
	}

	header #brand img {
		max-width: 120px;
	}

	header #top-header {
		align-items: center;
		display: flex;
		flex-direction: row;
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

	nav a.active,
	nav a:hover {
		background: var(--color-red) url(/assets/bg-navsubhover.png) repeat-x;
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

	nav .container {
		padding-left: 0;
		padding-right: 0;
	}

	nav::after {
		content: ' ';
		display: block;
		height: 1px;
		width: 100%;
		background: #861313;
		border-top: 1px solid var(--color-red);
		border-bottom: 1px solid #590d0d;
		box-shadow: rgba(255, 255, 255, 0.15) 0 1px 0;
	}

	header #andre {
		background: transparent url(/assets/icn-andre-48x240.png) 0 0 no-repeat;
		background-position: 0 0;
		background-size: 24px auto;
		color: #fe0;
		font-family: var(--font-special);
		font-size: 13px;
		height: 40px;
		padding-left: 30px;
		text-shadow: rgba(0, 0, 0, 0.5) 0 1px 0;
		width: 152px;
	}

	#site-container {
		overflow-y: hidden;
		min-height: 100%;
	}

	.border {
		margin-left: 45px;
		position: relative;
	}

	.border::before {
		border-left: 1px solid rgba(0, 0, 0, 0.3);
		box-shadow: 1px 0 0 rgba(255, 255, 255, 0.08);
		content: '';
		display: block;
		height: 30px;
		margin: -15px 0 0 -22.5px;
		left: 0;
		position: absolute;
		top: 50%;
		width: 0;
	}

	@media (min-width: 576px) {
		footer #credits {
			display: flex;
			flex-direction: row;
			justify-content: center;
		}

		footer #credits > * {
			flex: 1;
			margin: 0 var(--spacing);
		}

		footer #credits img {
			width: 160px;
		}
	}

	@media (min-width: 768px) {
		footer #credits img {
			width: 200px;
		}
	}
</style>
