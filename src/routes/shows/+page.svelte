<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>


<h1 class="sr-only">Shows</h1>

<section class="container shows">
	<ul>
		{#each data.shows as show}
			<li>
				<a href="/shows/{show.id}">
					<img src={show.poster ? `/shows/${show.poster}` : '/assets/default.jpg'} alt="">
					<h2>{show.title}</h2>
					<p>{show.description}</p>
				</a>
			</li>
		{/each}
	</ul>
</section>


<style>
	h2 {
		font-size: 16px;
		line-height: 20px;
		margin: 0;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	ul a {
		display: block;
		color: var(--color-gray);
	}

	ul a:hover h2 {
		color: var(--color-red-active);
	}

	ul img {
		display: block;
		margin-bottom: 5px;
		width: 100%;
	}

	ul li {
		margin-bottom: 30px;
	}

	.shows {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	@media (min-width: 576px) {
		ul {
			display: grid;
  			grid-template-columns: repeat(2, 1fr);
  			column-gap: 10px;
		}
	}

	@media (min-width: 992px) {
		ul {
			grid-template-columns: repeat(3, 1fr);
			column-gap: var(--spacing);
		}

		ul li {
			margin-bottom: 50px;
		}
	}
</style>
