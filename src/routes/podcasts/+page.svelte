<script lang="ts">
	import { base } from '$app/paths'
	import Icon, { IconType } from '$lib/components/Icon.svelte'

	const podcasts = [
		{
			title: 'Giant Bombcast',
			description: "The Giant Bombcast is the world's most beloved video game podcast.",
			image: 'bombcast.jpg',
			files: {
				'Giant Bombcast RSS (Premium Only)': 'Giant_Bombcast_Archive_Reduced.rss',
				'Giant Bombcast RSS (Premium and Ad-supported)': 'Giant_Bombcast_Archive.rss',
			},
		},
		{
			title: 'The Giant Beastcast',
			description:
				'The Giant Bomb East team gathers to talk about the week in video games, their lives, and basically anything that interests them. All from New York City!',
			image: 'beastcast.jpg',
			files: {
				'Giant Beastcast RSS (Premium Only)': 'Giant_Beastcast_Archive_Reduced.rss',
				'Giant Beastcast RSS (Premium and Ad-supported)': 'Giant_Beastcast_Archive.rss',
			},
		},
		{
			title: 'Danswers',
			description:
				"Dan Ryckert & Danny O'Dwyer provides answers to all of life's most pressing questions.",
			image: 'danswers.jpg',
			files: {
				'Danswers RSS': 'Danswers_Archive.rss',
			},
		},
		{
			title: 'Film and 40s',
			description:
				'An audio accompaniment to your movie viewing pleasure with your friends at Giant Bomb.',
			image: 'filmn40s.jpg',
			files: {
				'Film and 40s': 'Film_and_40s_Archive.rss',
			},
		},
		{
			title: 'The Hotsot',
			description: 'Giant Bomb\'s revival of the Gamespot "Hotspot" podcast.',
			image: 'hotspot.jpg',
			files: {
				'The Hotspot RSS': 'Hotspot_Revival_Archive.rss',
			},
		},
	]
</script>

<h1 class="sr-only">Podcasts</h1>

<section class="container">
	<ul class="podcasts">
		{#each podcasts as podcast}
			<li>
				<img src={`${base}/assets/podcasts/${podcast.image}`} alt="" />
				<h2>{podcast.title}</h2>
				<p>{podcast.description}</p>
				<ul class="files">
					{#each Object.entries(podcast.files) as [title, file]}
						<li>
							<a href={`${base}/podcasts/${file}`}>
								<Icon type={IconType.RSS} />
								{title}
							</a>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</section>

<svelte:head>
	<meta property="og:url" content="https://duders.zone/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Duders Zone" />
	<meta property="og:description" content="An archival website about video games." />
	<meta property="og:image" content="https://duders.zone/image.png" />
	<meta property="og:site_name" content="Duders Zone" />
	<title>Podcasts - Duders Zone</title>
	<meta name="description" content="An archival website about video games." />
</svelte:head>

<style>
	.files {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.files li {
		margin: var(--spacing-less) 0;
	}

	.podcasts {
		list-style: none;
		margin: var(--spacing) 0;
		padding: 0;
	}

	.podcasts h2 {
		margin: 0.5em 0 0;
	}

	.podcasts img {
		display: block;
		width: 100%;
	}

	.podcasts p {
		line-height: 1.5em;
		margin: 0.5em 0;
	}

	.podcasts > li {
		margin: 0 0 var(--spacing-more);
	}

	@media (min-width: 768px) {
		.podcasts {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			column-gap: var(--spacing);
		}

		.podcasts > li {
			margin: 0 0 var(--spacing);
		}
	}
</style>
