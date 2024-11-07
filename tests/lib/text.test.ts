// sum.test.js
import { describe, it, expect } from 'vitest'
import { extractWords, parseDate } from '$lib/text'

describe('extractWords', () => {
	it('covnerts text to a list of words', () => {
		expect(extractWords('test')).toStrictEqual(['test'])
		expect(extractWords('This is a test')).toStrictEqual(['this', 'is', 'a', 'test'])
		expect(extractWords("Testing 2: The return of test'd-hater Tom [REMIX]")).toStrictEqual([
			'testing',
			'2',
			'the',
			'return',
			'of',
			'testd',
			'hater',
			'tom',
			'remix',
		])
		expect(extractWords('The THE: the tHe-thE ThE')).toStrictEqual(['the'])
	})
})

describe('parseDate', () => {
	it('parses text as a month/day date', () => {
		expect(parseDate('1221')).toStrictEqual(new Date(2008, 11, 21))
		expect(parseDate('0101')).toStrictEqual(new Date(2008, 0, 1))
		expect(parseDate('not a date')).toStrictEqual(null)
		expect(parseDate('123')).toStrictEqual(null)
	})
})
