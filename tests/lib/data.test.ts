// sum.test.js
import { describe, it, expect } from 'vitest'
import { generateVideoIndex } from '$lib/data'

describe('generateVideoIndex', () => {

	it('creates an index of videos based on a list', () => {
		const videos = [
			{
				id: 'mfv',
				title: 'My Fancy Video',
				description: 'Description.',
				date: Date.now(),
				show: null,
				thumbnail: null,
			},
			{
				id: 'vgab',
				title: 'Video Games Are Bad',
				description: 'Description.',
				date: Date.now(),
				show: null,
				thumbnail: null,
			},
			{
				id: 'mbv',
				title: 'My Bad Video',
				description: 'Description.',
				date: Date.now(),
				show: null,
				thumbnail: null,
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
