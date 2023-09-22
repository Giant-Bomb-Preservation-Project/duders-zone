// sum.test.js
import { describe, it, expect } from 'vitest'
import { extractWords } from '$lib/text'

describe('extractWords', () => {
	it('coverts text to a list of words', () => {
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
