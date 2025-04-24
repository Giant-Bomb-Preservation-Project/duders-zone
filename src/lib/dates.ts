export const daysInEachMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

// Generate a list of all possible dates.
export function allDates(): Date[] {
	const dates: Date[] = []

	for (var month = 0; month < 12; month++) {
		for (var day = 1; day <= daysInEachMonth[month]; day++) {
			dates.push(new Date(2008, month, day))
		}
	}

	return dates
}
