// sum.test.js
import { describe, it, expect } from 'vitest'
import { dateToText, extractWords, prettyUrl, textToDate } from '$lib/text'

describe('dateToText', () => {
	it('converts a date to a text format', () => {
		expect(dateToText(new Date(2008, 11, 21))).toStrictEqual('1221')
		expect(dateToText(new Date(2008, 0, 1))).toStrictEqual('0101')
	})
})

describe('extractWords', () => {
	it('converts text to a list of words', () => {
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

describe('prettyUrl', () => {
	it('converts URLs to pretty text', () => {
		const tests: { [key: string]: string } = {
			'https://www.giantbomb.com/': 'giantbomb.com',
			'https://duders.zone': 'duders.zone',
			'https://www.twitch.tv/giantbombforever': 'twitch.tv/giantbombforever',
		}
		for (const input of Object.keys(tests)) {
			expect(prettyUrl(input)).toStrictEqual(tests[input])
		}
	})

	it('ignores non-url text', () => {
		const tests: { [key: string]: string } = {
			test: 'test',
			'this is text': 'this is text',
			'': '',
		}
		for (const input of Object.keys(tests)) {
			expect(prettyUrl(input)).toStrictEqual(tests[input])
		}
	})

	it('adds @ to Bluesky links', () => {
		const tests: { [key: string]: string } = {
			'https://bsky.app/profile/giantbomb.bsky.social': '@giantbomb.bsky.social',
			'https://bsky.app/profile/nextlander.com': '@nextlander.com',
		}
		for (const input of Object.keys(tests)) {
			expect(prettyUrl(input)).toStrictEqual(tests[input])
		}
	})

	it('reformats Mastodon links', () => {
		const tests: { [key: string]: string } = {
			'https://mastodon.social/@jeffgerstmann': '@jeffgerstmann@mastodon.social',
			'https://social.davesnider.com/@davesnider': '@davesnider@social.davesnider.com',
		}
		for (const input of Object.keys(tests)) {
			expect(prettyUrl(input)).toStrictEqual(tests[input])
		}
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
