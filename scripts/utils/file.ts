import { promises as fs } from 'fs'

// Check if a file exists
export async function checkExists(path) {
	try {
		await fs.stat(path)
		return true
	} catch {
		return false
	}
}

// Read a JSON file
export async function readJSONFile(path) {
	const contents = await fs.readFile(path, 'utf8')

	return JSON.parse(contents)
}

// Write a JSON file
export async function writeJSONFile(path, data) {
	await fs.writeFile(path, JSON.stringify(data, null, 4))
}
