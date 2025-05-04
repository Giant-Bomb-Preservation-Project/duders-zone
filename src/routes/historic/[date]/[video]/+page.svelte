<script lang="ts">
	import { goto } from '$app/navigation'
	import { base } from '$app/paths'
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import { dateToText } from '$lib/text'
	import { daysInEachMonth, months } from '$lib/dates'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	const currentUri = $derived(`${base}/historic/` + dateToText(data.date))

	let selectedMonth = $state(0)
	let selectedDay = $state(0)

	$effect(() => {
		selectedMonth = data.date.getMonth() + 1
		selectedDay = data.date.getDate()
	})

	const daysInSelectedMonth = $derived(daysInEachMonth[selectedMonth - 1])

	$effect(() => {
		selectedDay = Math.min(selectedDay, daysInSelectedMonth)
	})

	function gotoDate(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault()
		if (!event.currentTarget) {
			return
		}

		const month = event.currentTarget.month.value.padStart(2, '0')
		const day = event.currentTarget.day.value.padStart(2, '0')

		goto(`${base}/historic/${month}${day}`)
	}
</script>

<h1 class="sr-only">Historic</h1>

<section>
	<VideoEmbed video={data.video} />
</section>

<section class="container videos">
	<form onsubmit={gotoDate}>
		<select name="month" bind:value={selectedMonth}>
			{#each months as month, i}
				<option value={i + 1}>{month}</option>
			{/each}
		</select>
		<select name="day" bind:value={selectedDay}>
			{#each { length: daysInSelectedMonth } as _, i}
				<option value={i + 1}>{i + 1}</option>
			{/each}
		</select>
		<input type="submit" value="Go" />
	</form>

	<VideoList videos={data.videos} title="This Day in Giant Bomb History" rootUri={currentUri} />
</section>

<svelte:head>
	<meta property="og:url" content="https://duders.zone/videos/{data.video.show}/{data.video.id}" />
	<meta property="og:type" content="video.other" />
	<meta property="og:title" content={data.video.title} />
	<meta property="og:description" content={data.video.description} />
	<meta
		property="og:image"
		content={data.video.thumbnail || 'https://duders.zone/assets/default.jpg'}
	/>
	<meta property="og:site_name" content="Duders Zone" />
	<title>{data.video.title} - Historic Duders Zone</title>
	<meta name="description" content={data.video.description} />
</svelte:head>

<style>
	form {
		margin-bottom: var(--spacing);
	}

	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}
</style>
