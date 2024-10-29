<script lang="ts">
	import logoBw from '$lib/images/logo-bw.png'
	import type { Employee } from '$lib/types'

	export let employees: Employee[]

	const urlPattern = /.*:\/\/(www.)?([^\/]+)\/?([^\/]+)?.*/
	function prettyUrl(url: string): string {
		const matches = url.match(urlPattern)
		if (matches === null) {
			return url
		}

		if (matches[2] === 'twitter.com') {
			return `@${matches[3]}`
		}

		return matches[2] + (matches[3] ? `/${matches[3]}` : '')
	}
</script>

<ul class="employees">
	{#each employees as employee}
		<li class="employee">
			<img src={employee.image ? `/alumni/${employee.image}` : logoBw} alt="" />
			<h3>{employee.name}</h3>
			{#if employee.position}
				<p>{employee.position}</p>
			{/if}
			<p>{employee.years}</p>
			{#if employee.links}
				<ul class="links">
					{#each employee.links as link}
						<li>
							<a href={link}>{prettyUrl(link)}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</li>
	{/each}
</ul>

<style>
	h3 {
		margin: 0;
	}

	img {
		border-radius: 50%;
		box-shadow: var(--color-gray) 0 0 0 1px;
		display: block;
		margin-bottom: 10px;
		width: 100%;
	}

	ul.employees {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 30px;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	li.employee {
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
		ul.employees {
			display: flex;
			gap: 30px;
			flex-direction: row;
			flex-wrap: wrap;
			justify-items: center;
		}

		li.employee {
			flex-basis: calc(50% - 30px);
		}
	}

	@media (min-width: 768px) {
		li.employee {
			flex-basis: calc(34% - 30px);
		}
	}
</style>
