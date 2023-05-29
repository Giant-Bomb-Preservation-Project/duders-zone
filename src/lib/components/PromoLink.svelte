<script lang="ts">
	export let href: string
	export let title: string
	export let description: string
	export let image: string
</script>

<div>
	<a {href} style="background-image: url({image})">
		<h2>{title}</h2>
		<p>{description}</p>
	</a>
</div>

<style>
	a {
		background: none center center no-repeat;
		background-size: cover;
		color: white;
		display: block;
		margin-bottom: 1em;
		padding: 1em 1em 3em 1em;
	}

	p {
		color: inherit;
		margin: 0;
	}

	h2 {
		display: inline;
		font-size: 1.25rem;
		margin: 0;
	}

	@media (min-width: 992px) {
		a {
			margin-bottom: 0;
			padding: 8em 1em 1em 1em;
		}
	}
</style>
