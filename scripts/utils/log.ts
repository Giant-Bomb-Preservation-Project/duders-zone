// Log text in a given color (defaulting to plain)
export default function log(color: string, text: string) {
	if (!text) {
		text = color
		color = 'none'
	}

	switch (color) {
		case 'gray':
			console.debug(`\x1b[37m${text}\x1b[0m`)
			break
		case 'success':
			console.log(`\x1b[32m${text}\x1b[0m`)
			break
		case 'warn':
			console.log(`\x1b[33m${text}\x1b[0m`)
			break
		case 'error':
			console.error(`\x1b[31m${text}\x1b[0m`)
			break
		default:
			console.log(text)
	}
}
