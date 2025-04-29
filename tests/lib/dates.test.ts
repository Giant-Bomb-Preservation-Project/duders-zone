// sum.test.js
import { describe, it, expect } from 'vitest'
import { allDates } from '$lib/dates'

describe('allDates', () => {
	it('gets a list of all possible dates in a year', () => {
		expect(allDates().length).toStrictEqual(366)
	})
})
