<script lang="ts">
	import { base } from '$app/paths'
	import type { Video } from '$lib/data'

	interface Props {
		videos: Video[]
	}

	const { videos }: Props = $props()
</script>

<section>
	<ul>
		{#each videos as video}
			<li style="background-image: url('{video.thumbnail || '{base}/assets/default.jpg'}');">
				<a href={`${base}/videos/${video.show}/${video.id}`}>
					<hgroup>
						<span>
							Video
							<svg
								viewBox="6 8 12 10"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" />
							</svg>
						</span>
						<h3>{video.title}</h3>
					</hgroup>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	a {
		color: white;
		display: block;
		height: 180px;
		position: relative;
	}

	a:hover h3 {
		text-shadow:
			rgba(255, 255, 255, 0.75) 0 0 10px,
			rgba(0, 0, 0, 0.75) 0 1px 1px;
	}

	h3 {
		font-size: 24px;
		text-shadow: rgba(0, 0, 0, 0.75) 0 1px 1px;
		margin: 0;
		transition: text-shadow 0.25s;
		z-index: 1;
	}

	hgroup {
		align-items: start;
		background: linear-gradient(
			0deg,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0) 60%,
			rgba(0, 0, 0, 0) 100%
		);
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: end;
		left: 0;
		line-height: 30px;
		margin: 0;
		padding: 1em;
		position: absolute;
		right: 0;
		top: 0;
	}

	hgroup span {
		background: var(--color-red);
		color: #fff;
		display: block;
		font-family: 'Helvetica Neue', 'HelveticaNeue', Arial, sans-serif;
		font-size: 10px;
		line-height: 15px;
		font-weight: 600;
		text-transform: uppercase;
		margin: 0 0 0.5em;
		padding: 0 5px;
		box-shadow:
			rgba(255, 255, 255, 0.1) 0 1px 0 inset,
			rgba(0, 0, 0, 0.35) 0 1px 2px;
		border-radius: 4px;
		z-index: 1;
	}

	li {
		background: none center center no-repeat;
		background-size: cover;
		flex: 1;
		position: relative;
	}

	section {
		background: black;
		border-top: 1px solid black;
		position: relative;
	}

	section::after {
		background: rgba(255, 255, 255, 0.15);
		content: ' ';
		display: block;
		height: 1px;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 1;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	@media (min-width: 768px) {
		a {
			height: 250px;
		}

		li {
			box-shadow:
				rgba(0, 0, 0, 0.75) -1px 0 0 inset,
				rgba(255, 255, 255, 0.2) 1px 0 0 inset;
		}

		li:first-child {
			box-shadow: rgba(0, 0, 0, 0.75) -1px 0 0 inset;
		}

		li:last-child {
			box-shadow: rgba(255, 255, 255, 0.2) 1px 0 0 inset;
		}

		li:first-child a::after,
		li:last-child a::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			bottom: 0;
		}

		li:first-child a::after {
			background: linear-gradient(
				90deg,
				rgba(0, 0, 0, 1) 0%,
				rgba(0, 0, 0, 0) 60%,
				rgba(0, 0, 0, 0) 100%
			);
		}

		li:last-child a::after {
			background: linear-gradient(
				270deg,
				rgba(0, 0, 0, 1) 0%,
				rgba(0, 0, 0, 0) 60%,
				rgba(0, 0, 0, 0) 100%
			);
		}

		ul {
			display: flex;
		}
	}

	@media (min-width: 992px) {
		ul {
			max-width: 920px;
			margin-left: auto;
			margin-right: auto;
		}
	}

	@media (min-width: 1200px) {
		ul {
			max-width: 1130px;
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
