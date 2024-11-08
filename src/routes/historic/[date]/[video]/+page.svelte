<script lang="ts">
	import { goto } from '$app/navigation'
	import VideoEmbed from '$lib/components/VideoEmbed.svelte'
	import VideoList from '$lib/components/VideoList.svelte'
	import { dateToText } from '$lib/text'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	const { data }: Props = $props()
	const currentUri = $derived('/historic/' + dateToText(data.date))

	let selectedMonth = $state(0)
	let selectedDay = $state(0)

	$effect(() => {
		selectedMonth = data.date.getMonth() + 1
		selectedDay = data.date.getDate()
	})

	const daysInSelectedMonth = $derived(
		[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][selectedMonth - 1]
	)

	$effect(() => {
		selectedDay = Math.min(selectedDay, daysInSelectedMonth)
	})

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	function gotoDate(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault()
		if (!event.currentTarget) {
			return
		}

		const month = event.currentTarget.month.value.padStart(2, '0')
		const day = event.currentTarget.day.value.padStart(2, '0')

		goto(`/historic/${month}${day}`)
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

<style>
	form {
		margin-bottom: var(--spacing);
	}

	.videos {
		margin-bottom: var(--spacing);
		margin-top: var(--spacing);
	}
</style>
