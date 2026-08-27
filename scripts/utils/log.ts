// Log text in a color based on the level (defaulting to plain)
function log(level: string, text: string) {
	switch (level) {
		case 'debug':
			console.debug(`\x1b[37m${text}\x1b[0m`)
			break
		case 'success':
			console.log(`\x1b[32m${text}\x1b[0m`)
			break
		case 'orange':
			console.log(`\x1b[33m${text}\x1b[0m`)
			break
		case 'error':
			console.error(`\x1b[31m${text}\x1b[0m`)
			break
		default:
			console.log(text)
	}
}

export default {
	debug: (text: string) => log('debug', text),
	error: (text: string) => log('error', text),
	info: (text: string) => log('info', text),
	success: (text: string) => log('success', text),
	warn: (text: string) => log('orange', text),
}
