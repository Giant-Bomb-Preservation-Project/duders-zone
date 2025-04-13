import { promises as fs } from 'fs'

// Read a JSON file
export async function readJSONFile(path) {
	const contents = await fs.readFile(path, 'utf8')

	return JSON.parse(contents)
}

// Write a JSON file
export async function writeJSONFile(path, data) {
	await fs.writeFile(path, JSON.stringify(data, null, 4))
}
