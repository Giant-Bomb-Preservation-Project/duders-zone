// sum.test.js
import { describe, it, expect } from 'vitest'
import { DataStore } from '$lib/data'
import type { Video } from '$lib/data'

const testPeopleData = {
	alumni: [
		{
			name: 'Jeff Gerstmann',
			position: 'Co-founder, Editor-in-Chief',
			image: 'jeffge.jpg',
			links: ['https://www.patreon.com/jeffgerstmann', 'https://twitter.com/jeffgerstmann'],
		},
	],
	in_memoriam: [
		{
			name: 'Ryan Davis',
			years: '1979–2013',
			image: 'ryan.png',
		},
	],
}
const testShowData = [
	{
		id: 'this-aint-no-game',
		title: "This Ain't No Game",
		description:
			'Your look into the world of video game movies and the Wonderful Universe of movies with video game themes.',
		poster: '3026329-gb_default-16_9.jpg',
		logo: null,
		videos: [
			'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
			'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
			'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
		],
	},
	{
		id: 'cross-coast',
		title: 'Cross Coast',
		description: 'We join forces across the country to overcome all obstacles.',
		poster: '3171039-crosscoast.png',
		logo: '3171040-crosscoast_transparent.png',
		videos: ['gb-2300-15259-IDJIYS2', 'gb-2300-16398-IDJKE0C'],
	},
]
const testVideoData = [
	{
		id: 'gb-2300-15259-IDJIYS2',
		show: 'cross-coast',
		title: 'Cross Coast: Red Dead Redemption 2',
		description: "Let's posse up and see what's new in the world of Red Dead.",
		date: '2020-03-02T00:00:00Z',
		thumbnail: 'https://archive.org/services/img/gb-2300-15259-IDJIYS2',
		source: {
			internetarchive: 'gb-2300-15259-IDJIYS2',
		},
	},
	{
		id: 'gb-2300-16398-IDJKE0C',
		show: 'cross-coast',
		title: "Cross Coast: Abby's Not-Goodbye-But-See-You-Later Stream!",
		description:
			'Join us as we wish Abby well using full sentences, one word, and eventually questionable hand gestures.',
		date: '2020-11-25T00:00:00Z',
		thumbnail: 'https://archive.org/services/img/gb-2300-16398-IDJKE0C',
		source: {
			internetarchive: 'gb-2300-16398-IDJKE0C',
		},
	},
	{
		id: '2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
		show: 'this-aint-no-game',
		title: "This Ain't No Game: Double Dragon",
		description: "Ryan kicks off his movie tour with this...well...it's definitely a movie.",
		date: '2009-02-11T00:00:00Z',
		thumbnail:
			'https://archive.org/services/img/2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
		source: {
			internetarchive:
				'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
		},
	},
	{
		id: '2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
		show: 'this-aint-no-game',
		title: "This Ain't No Game: Street Fighter",
		description:
			"In honor of Street Fighter IV's release, we're sharing this epic piece of cinema.",
		date: '2009-02-19T00:00:00Z',
		thumbnail:
			'https://archive.org/services/img/2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
		source: {
			internetarchive:
				'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
		},
	},
	{
		id: '2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
		show: 'this-aint-no-game',
		title: "This Ain't No Game: Resident Evil",
		description: 'Ryan finds some love for the master of anti-dog karate.',
		date: '2009-02-26T00:00:00Z',
		thumbnail:
			'https://archive.org/services/img/2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
		source: {
			internetarchive:
				'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
		},
	},
]

describe('DataStore', () => {
	describe('constructor', () => {
		it('creates a DataStore based on person, video, and show data', () => {
			const expectedPeople = {
				alumni: [
					{
						name: 'Jeff Gerstmann',
						position: 'Co-founder, Editor-in-Chief',
						image: 'jeffge.jpg',
						links: [
							'https://www.patreon.com/jeffgerstmann',
							'https://twitter.com/jeffgerstmann',
						],
					},
				],
				inMemoriam: [
					{
						name: 'Ryan Davis',
						years: '1979–2013',
						image: 'ryan.png',
					},
				],
			}
			const expectedShows = {
				'cross-coast': {
					id: 'cross-coast',
					title: 'Cross Coast',
					description: 'We join forces across the country to overcome all obstacles.',
					poster: '3171039-crosscoast.png',
					logo: '3171040-crosscoast_transparent.png',
					videos: ['gb-2300-15259-IDJIYS2', 'gb-2300-16398-IDJKE0C'],
				},
				'this-aint-no-game': {
					id: 'this-aint-no-game',
					title: "This Ain't No Game",
					description:
						'Your look into the world of video game movies and the Wonderful Universe of movies with video game themes.',
					poster: '3026329-gb_default-16_9.jpg',
					logo: null,
					videos: [
						'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
						'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
						'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					],
				},
			}
			const expectedVideos = {
				'gb-2300-15259-IDJIYS2': {
					id: 'gb-2300-15259-IDJIYS2',
					title: 'Cross Coast: Red Dead Redemption 2',
					description: "Let's posse up and see what's new in the world of Red Dead.",
					date: new Date('2020-03-02T00:00:00Z'),
					thumbnail: 'https://archive.org/services/img/gb-2300-15259-IDJIYS2',
					show: 'cross-coast',
					source: {
						internetarchive: 'gb-2300-15259-IDJIYS2',
					},
				},
				'gb-2300-16398-IDJKE0C': {
					id: 'gb-2300-16398-IDJKE0C',
					title: "Cross Coast: Abby's Not-Goodbye-But-See-You-Later Stream!",
					description:
						'Join us as we wish Abby well using full sentences, one word, and eventually questionable hand gestures.',
					date: new Date('2020-11-25T00:00:00Z'),
					thumbnail: 'https://archive.org/services/img/gb-2300-16398-IDJKE0C',
					show: 'cross-coast',
					source: {
						internetarchive: 'gb-2300-16398-IDJKE0C',
					},
				},
				'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY': {
					id: '2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
					title: "This Ain't No Game: Double Dragon",
					description:
						"Ryan kicks off his movie tour with this...well...it's definitely a movie.",
					date: new Date('2009-02-11T00:00:00Z'),
					thumbnail:
						'https://archive.org/services/img/2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
					show: 'this-aint-no-game',
					source: {
						internetarchive:
							'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
					},
				},
				'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N': {
					id: '2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
					title: "This Ain't No Game: Street Fighter",
					description:
						"In honor of Street Fighter IV's release, we're sharing this epic piece of cinema.",
					date: new Date('2009-02-19T00:00:00Z'),
					thumbnail:
						'https://archive.org/services/img/2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
					show: 'this-aint-no-game',
					source: {
						internetarchive:
							'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
					},
				},
				'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY': {
					id: '2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					title: "This Ain't No Game: Resident Evil",
					description: 'Ryan finds some love for the master of anti-dog karate.',
					date: new Date('2009-02-26T00:00:00Z'),
					thumbnail:
						'https://archive.org/services/img/2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					show: 'this-aint-no-game',
					source: {
						internetarchive:
							'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					},
				},
			}

			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)

			expect(dataStore.people).toStrictEqual(expectedPeople)
			expect(dataStore.shows).toStrictEqual(expectedShows)
			expect(dataStore.videos).toStrictEqual(expectedVideos)
		})

		it('generates a video index', () => {
			const expected = new Map(
				Object.entries({
					'2': ['gb-2300-15259-IDJIYS2'],
					abbys: ['gb-2300-16398-IDJKE0C'],
					aint: [
						'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
						'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
						'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					],
					but: ['gb-2300-16398-IDJKE0C'],
					coast: ['gb-2300-15259-IDJIYS2', 'gb-2300-16398-IDJKE0C'],
					cross: ['gb-2300-15259-IDJIYS2', 'gb-2300-16398-IDJKE0C'],
					dead: ['gb-2300-15259-IDJIYS2'],
					double: [
						'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
					],
					dragon: [
						'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
					],
					evil: ['2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY'],
					fighter: [
						'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
					],
					game: [
						'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
						'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
						'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					],
					goodbye: ['gb-2300-16398-IDJKE0C'],
					later: ['gb-2300-16398-IDJKE0C'],
					no: [
						'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
						'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
						'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					],
					not: ['gb-2300-16398-IDJKE0C'],
					red: ['gb-2300-15259-IDJIYS2'],
					redemption: ['gb-2300-15259-IDJIYS2'],
					resident: [
						'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					],
					see: ['gb-2300-16398-IDJKE0C'],
					stream: ['gb-2300-16398-IDJKE0C'],
					street: [
						'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
					],
					this: [
						'2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
						'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
						'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					],
					you: ['gb-2300-16398-IDJKE0C'],
				})
			)

			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)

			expect(dataStore.videoIndex).toStrictEqual(expected)
		})
	})

	describe('getRandomShows', () => {
		it('gets a list of N random shows', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)

			for (var i = 0; i < 5; i++) {
				const result = dataStore.getRandomShows(1)

				expect(result.length).toBe(1)
				expect(testShowData.map((x) => x.id)).toContain(result[0].id)
			}
		})
	})

	describe('getRandomVideos', () => {
		it('gets a list of N random videos', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)

			for (var i = 0; i < 5; i++) {
				const result = dataStore.getRandomVideos(2)

				expect(result.length).toBe(2)
				expect(testVideoData.map((x) => x.id)).toContain(result[0].id)
				expect(testVideoData.map((x) => x.id)).toContain(result[1].id)
			}
		})
	})

	describe('getShowById', () => {
		it('gets a specific show', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getShowById('this-aint-no-game')

			expect(result).toStrictEqual(dataStore.shows['this-aint-no-game'])
		})
	})

	describe('getShows', () => {
		it('gets a list of all shows', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getShows()

			expect(result.map((x) => x.id)).toStrictEqual(['cross-coast', 'this-aint-no-game'])
		})
	})

	describe('getVideoById', () => {
		it('gets a specific show', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getVideoById(
				'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N'
			)

			expect(result).toStrictEqual(
				dataStore.videos[
					'2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N'
				]
			)
		})
	})

	describe('getVideosForDay', () => {
		it('gets a specific show', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getVideosForDay(new Date('2023-11-25T00:00:00Z'))

			expect(result.map((x) => x.id)).toStrictEqual(['gb-2300-16398-IDJKE0C'])
		})
	})

	describe('getVideosForShow', () => {
		it('gets a specific show', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getVideosForShow(dataStore.shows['cross-coast'])

			expect(result.map((x) => x.id)).toStrictEqual([
				'gb-2300-16398-IDJKE0C',
				'gb-2300-15259-IDJIYS2',
			])
		})
	})

	describe('searchVideos', () => {
		it('gets a specific video', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.searchVideos('evil')

			expect(result.map((x) => x.id)).toStrictEqual([
				'2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
			])
		})

		it('weighs exact matches higher than non-exact ones', () => {
			const videoData = [
				{
					id: 'not_exact',
					show: 'this-aint-no-game',
					title: 'Not Exact Testing',
					description: '',
					date: '2020-03-02T00:00:00Z',
					thumbnail: null,
				},
				{
					id: 'exact',
					show: 'this-aint-no-game',
					title: 'Exact Test',
					description: '',
					date: '2020-03-02T00:00:00Z',
					thumbnail: null,
				},
				{
					id: 'not_included',
					show: 'this-aint-no-game',
					title: 'Not Included',
					description: '',
					date: '2020-03-02T00:00:00Z',
					thumbnail: null,
				},
			]

			const dataStore = new DataStore(testPeopleData, testShowData, videoData)
			const result = dataStore.searchVideos('test')

			expect(result.map((x) => x.id)).toStrictEqual(['exact', 'not_exact'])
		})

		it('weighs multiple word matches higher than single ones', () => {
			const videoData = [
				{
					id: 'only_one',
					show: 'this-aint-no-game',
					title: 'Test',
					description: '',
					date: '2020-03-02T00:00:00Z',
					thumbnail: null,
				},
				{
					id: 'two',
					show: 'this-aint-no-game',
					title: 'Test Thing',
					description: '',
					date: '2020-03-02T00:00:00Z',
					thumbnail: null,
				},
				{
					id: 'none',
					show: 'this-aint-no-game',
					title: 'Explosive Bananas',
					description: '',
					date: '2020-03-02T00:00:00Z',
					thumbnail: null,
				},
			]

			const dataStore = new DataStore(testPeopleData, testShowData, videoData)
			const result = dataStore.searchVideos('test thing')

			expect(result.map((x) => x.id)).toStrictEqual(['two', 'only_one'])
		})
	})
})
