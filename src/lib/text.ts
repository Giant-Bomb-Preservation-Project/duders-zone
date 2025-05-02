const ignoredCharacters = /[']/g
const wordCharacter = /\w/i
const dateFormat = /^(\d\d)(\d\d)$/
const urlPattern = /.*:\/\/(www.)?([^\/]+)\/?([^\/]+)?.*/

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
	const matches = url.match(urlPattern)
	if (matches === null) {
		return url
	}

	if (matches[2] === 'twitter.com') {
		return `@${matches[3]}`
	}

	return matches[2] + (matches[3] ? `/${matches[3]}` : '')
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
