const ignoredCharacters = /[']/g
const wordCharacter = /\w/i
const dateFormat = /^(\d\d)(\d\d)$/
const mastodonHosts = ['hachyderm.io', 'mastodon.social', 'social.davesnider.com']

// Convert a Date object to text in the format "MMDD"
export function dateToText(date: Date): string {
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')

	return `${month}${day}`
}

// Extract all the significant words from a piece of text
export function extractWords(text: string): string[] {
	text = text.replace(ignoredCharacters, '')

	const words: Set<string> = new Set()
	let currentWord = ''

	for (const character of text.toLowerCase()) {
		if (!wordCharacter.test(character)) {
			if (currentWord !== '') {
				words.add(currentWord)
				currentWord = ''
			}
		} else {
			currentWord += character
		}
	}

	if (currentWord !== '') {
		words.add(currentWord)
	}

	return Array.from(words.keys())
}

// Convert a URL to a "pretty" (more readable) version
export function prettyUrl(url: string): string {
	var realUrl: URL
	try {
		realUrl = new URL(url)
	} catch {
		return url // ignore errors
	}

	if (realUrl.hostname === 'bsky.app') {
		return '@' + realUrl.pathname.replace('/profile/', '')
	}

	if (mastodonHosts.includes(realUrl.hostname) && realUrl.pathname.startsWith('/@')) {
		return realUrl.pathname.replace('/', '') + '@' + realUrl.hostname
	}

	return realUrl.hostname.replace('www.', '') + (realUrl.pathname != '/' ? realUrl.pathname : '')
}

// Convert text in the format "MMDD" to a Date object
export function textToDate(text: string): Date | null {
	const result = text.match(dateFormat)
	if (!result) {
		return null
	}

	const month = parseInt(result[1])
	const day = parseInt(result[2])
	return new Date(2008, month - 1, day)
}
