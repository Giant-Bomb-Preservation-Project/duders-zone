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
			case 'www.patreon.com':
				return IconType.Patreon
			case 'www.twitch.tv':
				return IconType.Twitch
			default:
				return IconType.Website
		}
	}
</script>

<div class="container">
	<p class="note">
		Some of the many fine folks who made Giant Bomb what it was
		<a href="https://www.youtube.com/watch?v=gVvUuSYp7-s">&hearts;</a>
	</p>
	<section>
		<h1 class="sr-only">Alumni</h1>
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
	<title>Duders - Duders Zone</title>
	<meta name="description" content="An archival website about video games." />
</svelte:head>

<style>
	.container {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	a {
		color: var(--color-text-muted);
	}

	a:hover {
		color: var(--color-red);
	}

	h1 {
		font-size: 32px;
		line-height: 35px;
		margin: 2em 0 1em;
		text-align: center;
	}

	h2 {
		font-size: 24px;
		margin: 0;
	}

	img {
		border: 1px solid white;
		width: 100%;
	}

	p {
		font-size: 12pt;
		font-style: italic;
		margin: 1em 0;
		text-align: center;
	}

	p.thank-you {
		font-size: 22px;
		margin: 3em 0;
	}

	p.note {
		color: var(--color-text-muted);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	ul.in-memoriam {
		margin: 3em 0;
		text-align: center;
	}

	ul.in-memoriam img {
		border-radius: 50%;
		max-width: 300px;
		margin-bottom: 1em;
	}

	ul.links {
		font-size: 11pt;
	}

	ul.links li {
		margin: 0.3em 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	ul.people {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2em;
		margin: 2em 0;
		justify-content: flex-start;
	}

	ul.people img {
		border-radius: 4px;
	}

	ul.people li {
		display: flex;
		flex: 0 0 100%;
	}

	ul.people .info {
		flex: 1;
		padding: 0.25em 0.85em;
	}

	ul.people .image {
		flex: 0 0 33%;
	}

	@media (min-width: 768px) {
		ul.people {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-items: center;
		}

		ul.people li {
			flex-basis: calc(50% - 1em);
		}

		ul.people .image {
			flex-basis: 120px;
		}
	}

	@media (min-width: 1200px) {
		ul.people li {
			flex-basis: calc(34% - 2em);
		}
	}
</style>
