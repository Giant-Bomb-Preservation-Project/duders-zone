// sum.test.js
import { describe, it, expect } from 'vitest'
import { generateVideoIndex } from '$lib/data'
import type { Video } from '$lib/data'

describe('generateVideoIndex', () => {
	it('creates an index of videos based on a list', () => {
		const videos: Video[] = [
			{
				id: 'mfv',
				title: 'My Fancy Video',
				description: 'Description.',
				date: new Date(),
				show: undefined,
				thumbnail: undefined,
			},
			{
				id: 'vgab',
				title: 'Video Games Are Bad',
				description: 'Description.',
				date: new Date(),
				show: undefined,
				thumbnail: undefined,
			},
			{
				id: 'mbv',
				title: 'My Bad Video',
				description: 'Description.',
				date: new Date(),
				show: undefined,
				thumbnail: undefined,
			},
		]
		const expected: Map<string, string[]> = new Map()
		expected.set('my', ['mfv', 'mbv'])
		expected.set('fancy', ['mfv'])
		expected.set('video', ['mfv', 'vgab', 'mbv'])
		expected.set('games', ['vgab'])
		expected.set('are', ['vgab'])
		expected.set('bad', ['vgab', 'mbv'])

		const result = generateVideoIndex(videos)

		expect(result).toStrictEqual(expected)
	})
})
