// sum.test.js
import { describe, it, expect } from 'vitest'
import { dateToText, extractWords, textToDate } from '$lib/text'

describe('dateToText', () => {
	it('converts a date to a text format', () => {
		expect(dateToText(new Date(2008, 11, 21))).toStrictEqual('1221')
		expect(dateToText(new Date(2008, 0, 1))).toStrictEqual('0101')
	})
})

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

describe('textToDate', () => {
	it('parses text as a month/day date', () => {
		expect(textToDate('1221')).toStrictEqual(new Date(2008, 11, 21))
		expect(textToDate('0101')).toStrictEqual(new Date(2008, 0, 1))
		expect(textToDate('not a date')).toStrictEqual(null)
		expect(textToDate('123')).toStrictEqual(null)
	})
})
