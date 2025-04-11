import axios from 'axios'

// Headers sent with each request
const HEADERS = {
	'user-agent': 'Giant-Bomb-Preservation-Project/duders-zone',
}

// Amount of times to retry a GET request
const REQUEST_ATTEMPTS = 3

// Make a GET request to the given URL
export async function getRequest(url: String, queryParams: Object) {
	let times = 0
	while (times < REQUEST_ATTEMPTS) {
		try {
			const queryString = Object.keys(queryParams)
				.map((k) => `${k}=${queryParams[k]}`)
				.join('&')
			console.debug(`GET ${url}?${queryString}`)
			const response = await axios.get(url, {
				headers: HEADERS,
				params: queryParams,
			})

			return response.data
		} catch (e) {
			if (e instanceof axios.AxiosError) {
				console.warn(`WARNING! Unexpected status code: ${e.response?.status}`)
				console.warn(e.response?.data)
			} else {
				throw e
			}
		}

		times += 1
		console.debug(`Retrying in ${RETRY_DELAY} seconds...`)
		await sleep(RETRY_DELAY)
	}

	throw new Error('Unable to complete request')
}

// Sleep function (thanks to: https://stackoverflow.com/a/39914235)
export function sleep(seconds) {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
