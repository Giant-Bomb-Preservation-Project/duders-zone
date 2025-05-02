<script lang="ts">
	import { base } from '$app/paths'
	import { prettyUrl } from '$lib/text'
	import logoBw from '$lib/images/logo-bw.png'
	import type { People } from '$lib/data'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	const { people } = data
</script>

<div class="container">
	<section>
		<h1>Alumni</h1>
		<ul class="people">
			{#each people.alumni as person}
				<li class="person">
					<img
						src={person.image ? `${base}/assets/people/${person.image}` : logoBw}
						alt=""
					/>
					<h2>{person.name}</h2>
					<p>{person.position}</p>
					{#if person.links}
						<ul class="links">
							{#each person.links as link}
								<li>
									<a href={link}>{prettyUrl(link)}</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h1>In Memoriam</h1>
		<ul class="people">
			{#each people.inMemoriam as person}
				<li class="person">
					<img
						src={person.image ? `${base}/assets/people/${person.image}` : logoBw}
						alt=""
					/>
					<h2>{person.name}</h2>
					<p>{person.years}</p>
				</li>
			{/each}
		</ul>
	</section>

	<p class="thank-you">Thanks for everything! See you next game.</p>
</div>

<svelte:head>
	<meta property="og:url" content="https://duders.zone/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Duders Zone" />
	<meta property="og:description" content="An archival website about video games." />
	<meta property="og:image" content="https://duders.zone/image.png" />
	<meta property="og:site_name" content="Duders Zone" />
	<title>Alumni - Duders Zone</title>
	<meta name="description" content="An archival website about video games." />
</svelte:head>

<style>
	.container {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	h2 {
		margin: 0;
	}

	img {
		border-radius: 50%;
		box-shadow: var(--color-gray) 0 0 0 1px;
		display: block;
		margin-bottom: 10px;
		width: 100%;
	}

	p.thank-you {
		font-size: 22px;
		font-style: italic;
		margin: 3em 0;
		text-align: center;
	}

	ul.people {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 30px;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	li.person {
		flex-basis: 100%;
		margin-bottom: 30px;
		text-align: center;
	}

	ul.links {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	@media (min-width: 576px) {
		ul.people {
			display: flex;
			gap: 30px;
			flex-direction: row;
			flex-wrap: wrap;
			justify-items: center;
		}

		li.person {
			flex-basis: calc(50% - 30px);
		}
	}

	@media (min-width: 768px) {
		li.person {
			flex-basis: calc(34% - 30px);
		}
	}
</style>
