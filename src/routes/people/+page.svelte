<script lang="ts">
	import { base } from '$app/paths'
	import Icon, { IconType } from '$lib/components/Icon.svelte'
	import { prettyUrl } from '$lib/text'
	import logoBw from '$lib/images/logo-bw.png'
	import type { People } from '$lib/data'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	const { people } = data

	function icon(url: string): IconType {
		const hostname = new URL(url).hostname

		switch (hostname) {
			case 'bsky.app':
				return IconType.Bluesky
			case 'mastodon.social':
			case 'social.davesnider.com':
				return IconType.Mastodon
			case 'www.twitch.tv':
				return IconType.Twitch
			default:
				return IconType.Website
		}
	}
</script>

<div class="container">
	<section>
		<h1>Alumni</h1>
		<ul class="people">
			{#each people.alumni as person}
				<li>
					<div class="image">
						<img
							src={person.image ? `${base}/assets/people/${person.image}` : logoBw}
							alt=""
						/>
					</div>
					<div class="info">
						<h2>{person.name}</h2>
						<p>{person.position}</p>
						{#if person.links}
							<ul class="links">
								{#each person.links as link}
									<li>
										<a href={link}>
											<Icon type={icon(link)} />
											{prettyUrl(link)}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h1>In Memoriam</h1>
		<ul class="in-memoriam">
			{#each people.inMemoriam as person}
				<li>
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

	h1 {
		font-size: 32px;
		line-height: 35px;
		text-align: center;
	}

	h2 {
		margin: 0;
	}

	img {
		width: 100%;
	}

	p.thank-you {
		font-size: 22px;
		font-style: italic;
		margin: 3em 0;
		text-align: center;
	}

	ul.in-memoriam {
		list-style: none;
		margin: 0;
		padding: 0;
		text-align: center;
	}

	ul.in-memoriam img {
		border-radius: 50%;
		max-width: 300px;
		margin-bottom: 1em;
	}

	ul.links {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	ul.links li {
		margin: 0.2em 0;
	}

	ul.people {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2em;
		justify-content: flex-start;
	}

	ul.people img {
		border: 1px solid white;
		border-radius: 4px;
	}

	ul.people li {
		display: flex;
		flex-basis: 100%;
	}

	ul.people .info {
		flex: 1;
		padding: 0.5em 0.85em;
	}

	ul.people .image {
		flex: 0 0 120px;
	}

	@media (min-width: 768px) {
		ul.people {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-items: center;
		}

		ul.people li {
			flex-basis: calc(50% - 2em);
		}
	}

	@media (min-width: 1200px) {
		ul.people li {
			flex-basis: calc(34% - 2em);
		}
	}
</style>
