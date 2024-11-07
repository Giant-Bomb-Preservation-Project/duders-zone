const ignoredCharacters = /[']/g
const wordCharacter = /\w/i
const dateFormat = /^(\d\d)(\d\d)$/

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

export function parseDate(text: string): Date | null {
	const result = text.match(dateFormat)
	if (!result) {
		return null
	}

	const month = parseInt(result[1])
	const day = parseInt(result[2])
	return new Date(2008, month - 1, day)
}
