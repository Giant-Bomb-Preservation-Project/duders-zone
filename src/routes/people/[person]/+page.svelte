<script lang="ts">
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import VideoList from '$lib/components/VideoList.svelte'
	import Icon, { iconForUrl } from '$lib/components/Icon.svelte'
	import logoBw from '$lib/images/logo-bw.png'
	import { prettyUrl } from '$lib/text'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
</script>

<div class="container">
	<section class="person">
		<div class="image">
			<img
				src={data.person.image ? `${base}/assets/people/${data.person.image}` : logoBw}
				alt="Photo of {data.person.name}"
			/>
		</div>
		<div class="info">
			<h1>{data.person.name}</h1>
			<ul class="links">
				{#each data.person.links as link}
					<li>
						<a href={link}>
							<Icon type={iconForUrl(link)} />
							{prettyUrl(link)}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section>
		<VideoList videos={data.videos} title="Videos" perPage={24} pageNumber={data.pageNumber} />
	</section>
</div>

<svelte:head>
	<meta property="og:url" content="https://duders.zone/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Duders Zone" />
	<meta property="og:description" content="An archival website about video games." />
	<meta property="og:image" content="https://duders.zone/image.png" />
	<meta property="og:site_name" content="Duders Zone" />
	<title>{data.person.name} - Duders Zone</title>
	<meta name="description" content="An archival website about video games." />
</svelte:head>

<style>
	h1 {
		margin: 0.25em 0;
	}

	.links {
		line-height: 1.6em;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.person {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	.person img {
		display: block;
		width: 100%;
	}

	@media (min-width: 576px) {
		.person {
			display: flex;
		}

		.person img {
			border-radius: 50%;
		}

		.person .image {
			flex: 100px 0;
			margin-right: var(--spacing);
		}
	}

	@media (min-width: 992px) {
		.person .image {
			flex: 120px 0;
		}
	}
</style>
