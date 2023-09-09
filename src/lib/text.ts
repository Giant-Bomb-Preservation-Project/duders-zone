const wordCharacter = /\w/i

// Extract all the significant words from a piece of text
export function extractWords(text: string): string[] {
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
