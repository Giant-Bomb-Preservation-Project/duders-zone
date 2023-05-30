<script lang="ts">
	import EmployeeList from '$lib/components/EmployeeList.svelte'

	import type { Employee } from '$lib/components/EmployeeList.svelte'

	const current: Employee[] = [
		{
			name: 'Jeff Bakalar',
			position: 'General Manager',
			years: '2021–present',
			image: 'jeffb.png',
			links: [
				'https://twitter.com/jeffbakalar'
			],
		},
		{
			name: 'Jeff Grubb',
			position: 'News Editor',
			years: '2022–present',
			image: 'jeffgr.png',
			links: [
				'https://twitter.com/JeffGrubb',
			],
		},
		{
			name: 'Tamoor Hussain',
			position: 'Editor',
			years: '2022–present',
			image: 'tam.jpg',
			links: [
				'https://twitter.com/tamoorh',
			],
		},
		{
			name: 'Lucy James',
			position: 'Editor',
			years: '2022–present',
			image: 'lucy.jpg',
			links: [
				'https://twitter.com/lucyjamesgames'
			],
		},
		{
			name: 'Jan Ochoa',
			position: 'Senior Producer',
			years: '2017–present',
			image: 'jan.png',
			links: [
				'https://twitter.com/_janjerome',
			],
		},
		{
			name: 'Dan Ryckert',
			position: 'Creative Director',
			years: '2014–2020, 2022–present',
			image: 'danr.png',
			links: [
				'https://twitter.com/danryckert',
				'https://www.twitch.tv/danryckert',
			],
		},
	]

	const former = [
		{
			name: 'Vincent "Vinny" Caravella',
			position: 'Director of production',
			years: '2008–2021',
			image: 'vinny.png',
			links: [
				'https://nextlander.com/',
				'https://twitter.com/VinnyCaravella'
			],
		},
		{
			name: 'Jeff Gerstmann',
			position: 'Co-founder, Editor-in-Chief',
			years: '2008–2022',
			image: 'jeffge.jpg',
			links: [
				'https://www.patreon.com/jeffgerstmann',
				'https://twitter.com/jeffgerstmann',
			],
		},
		{
			name: 'Patrick Klepek',
			position: 'Senior news editor',
			years: '2011–2014',
			image: 'patrick.jpg',
			links: [
				'https://linktr.ee/patrickklepek',
				'https://twitter.com/patrickklepek'
			],
		},
		{
			name: 'Alex Navarro',
			position: 'Senior editor',
			years: '2010–2021',
			image: 'alex.png',
			links: [
				'https://nextlander.com/',
				'https://twitter.com/alex_navarro'
			],
		},
		{
			name: "Jess O'Brien",
			position: 'Video Producer',
			years: '2021–2023',
			image: 'jess.png',
			links: [
				'https://voidburger.com',
				'https://twitter.com/VoidBurger'
			],
		},
		{
			name: 'Jason Oestreicher',
			position: 'Senior Video Producer',
			years: '2014–2023',
			image: 'jason.png',
			links: [
				'https://www.twitch.tv/unastrike',
				'https://twitter.com/unastrike',
			],
		},
		{
			name: 'Ben Pack',
			position: 'Editor',
			years: '2017–2021',
			image: 'ben.png',
			links: [
				'https://twitter.com/PackBenPack',
			],
		},
		{
			name: 'Matthew Rorie',
			position: 'Senior Marketing Manager',
			years: '2013–2023',
			image: 'matthew.jpg',
			links: [
				'https://twitter.com/frailgesture'
			],
		},
		{
			name: 'Abby Russell',
			position: 'Associate producer',
			years: '2017–2020',
			image: 'abby.png',
			links: [
				"https://www.abbyfrombrooklyn.com/",
				"https://twitter.com/ybbaaabby",
			],
		},
		{
			name: 'Drew Scanlon',
			position: 'Senior video producer',
			years: '2009–2017',
			image: 'drew.png',
			links: [
				"https://www.youtube.com/clothmap",
				"https://twitter.com/drewscanlon",
			],
		},
		{
			name: 'Brad Shoemaker',
			position: 'Senior editor',
			years: '2008–2021',
			image: 'brad.png',
			links: [
				'https://nextlander.com/',
				'https://twitter.com/bradshoemaker',
			],
		},
		{
			name: 'Dave Snider',
			position: 'Co-founder, designer',
			years: '2008–2013',
			image: 'dave.png',
			links: [
				'https://social.davesnider.com/@davesnider',
				'https://twitter.com/enemykite',
			],
		},
		{
			name: 'Austin Walker',
			position: 'News editor',
			years: '2015–2016',
			image: 'austin.jpg',
			links: [
				'https://www.clockworkworlds.com/',
				'https://twitter.com/austin_walker',
			],
		},
	]

	const memoriam = [
		{
			name: 'Ryan Davis',
			years: '1979–2013',
			image: 'ryan.png',
		}
	]

</script>


<div class="container">
	<h1>Alumni</h1>

	<section>
		<h2>Current Employees</h2>
		<EmployeeList employees={current} />
	</section>

	<section>
		<h2>Former Employees</h2>
		<EmployeeList employees={former} />
	</section>

	<section>
		<h2>In Memoriam</h2>
		<EmployeeList employees={memoriam} />
	</section>

	<p>Thanks for everything! See you next game.</p>
</div>


<style>
	.container {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}

	h2 {
		text-align: center;
	}

	p {
		font-size: 22px;
		font-style: italic;
		margin: 3em 0;
		text-align: center;
	}
</style>
