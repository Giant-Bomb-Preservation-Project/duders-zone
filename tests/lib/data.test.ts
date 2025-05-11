// sum.test.js
import { describe, it, expect } from 'vitest'
import { DataStore } from '$lib/data'
import type { Video } from '$lib/data'

const testPeopleData = {
	alumni: [
		{
			id: 'jeff',
			name: 'Jeff Gerstmann',
			image: 'jeffge.jpg',
			links: ['https://www.patreon.com/jeffgerstmann', 'https://twitter.com/jeffgerstmann'],
		},
	],
	in_memoriam: [
		{
			id: 'ryan',
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
		videos: ['IDBF5DWY', 'IDIAQF2N', 'IDB90NXY'],
	},
	{
		id: 'cross-coast',
		title: 'Cross Coast',
		description: 'We join forces across the country to overcome all obstacles.',
		poster: '3171039-crosscoast.png',
		logo: '3171040-crosscoast_transparent.png',
		videos: ['2300-15259', '2300-16398'],
	},
]
const testVideoData = [
	{
		id: '2300-15259',
		show: 'cross-coast',
		title: 'Cross Coast: Red Dead Redemption 2',
		description: "Let's posse up and see what's new in the world of Red Dead.",
		date: '2020-03-02T00:00:00Z',
		thumbnail: 'https://archive.org/services/img/gb-2300-15259-IDJIYS2',
		duration: 7300,
		source: {
			internetarchive: 'gb-2300-15259-IDJIYS2',
		},
	},
	{
		id: '2300-16398',
		show: 'cross-coast',
		title: "Cross Coast: Abby's Not-Goodbye-But-See-You-Later Stream!",
		description:
			'Join us as we wish Abby well using full sentences, one word, and eventually questionable hand gestures.',
		date: '2020-11-25T00:00:00Z',
		thumbnail: 'https://archive.org/services/img/gb-2300-16398-IDJKE0C',
		duration: 7925,
		source: {
			internetarchive: 'gb-2300-16398-IDJKE0C',
		},
	},
	{
		id: 'IDBF5DWY',
		show: 'this-aint-no-game',
		title: 'Double Dragon',
		description: "Ryan kicks off his movie tour with this...well...it's definitely a movie.",
		date: '2009-02-11T00:00:00Z',
		thumbnail:
			'https://archive.org/services/img/2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
		duration: 1,
		source: {
			internetarchive: 'IDBF5DWY',
		},
	},
	{
		id: 'IDIAQF2N',
		show: 'this-aint-no-game',
		title: 'Street Fighter',
		description:
			"In honor of Street Fighter IV's release, we're sharing this epic piece of cinema.",
		date: '2009-02-19T00:00:00Z',
		thumbnail:
			'https://archive.org/services/img/2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
		duration: null,
		source: {
			internetarchive: 'IDIAQF2N',
		},
	},
	{
		id: 'IDB90NXY',
		show: 'this-aint-no-game',
		title: 'Resident Evil',
		description: 'Ryan finds some love for the master of anti-dog karate.',
		date: '2009-02-26T00:00:00Z',
		thumbnail:
			'https://archive.org/services/img/2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
		duration: null,
		source: {
			internetarchive: 'IDB90NXY',
		},
	},
]

describe('DataStore', () => {
	describe('constructor', () => {
		it('creates a DataStore based on person, video, and show data', () => {
			const expectedPeople = {
				alumni: [
					{
						id: 'jeff',
						name: 'Jeff Gerstmann',
						image: 'jeffge.jpg',
						links: [
							'https://www.patreon.com/jeffgerstmann',
							'https://twitter.com/jeffgerstmann',
						],
					},
				],
				inMemoriam: [
					{
						id: 'ryan',
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
					videos: ['2300-15259', '2300-16398'],
				},
				'this-aint-no-game': {
					id: 'this-aint-no-game',
					title: "This Ain't No Game",
					description:
						'Your look into the world of video game movies and the Wonderful Universe of movies with video game themes.',
					poster: '3026329-gb_default-16_9.jpg',
					logo: null,
					videos: ['IDBF5DWY', 'IDIAQF2N', 'IDB90NXY'],
				},
			}
			const expectedVideos = {
				'2300-15259': {
					id: '2300-15259',
					title: 'Cross Coast: Red Dead Redemption 2',
					description: "Let's posse up and see what's new in the world of Red Dead.",
					date: new Date('2020-03-02T00:00:00Z'),
					thumbnail: 'https://archive.org/services/img/gb-2300-15259-IDJIYS2',
					duration: '02:01:40',
					show: 'cross-coast',
					source: {
						internetarchive: 'gb-2300-15259-IDJIYS2',
					},
				},
				'2300-16398': {
					id: '2300-16398',
					title: "Cross Coast: Abby's Not-Goodbye-But-See-You-Later Stream!",
					description:
						'Join us as we wish Abby well using full sentences, one word, and eventually questionable hand gestures.',
					date: new Date('2020-11-25T00:00:00Z'),
					thumbnail: 'https://archive.org/services/img/gb-2300-16398-IDJKE0C',
					duration: '02:12:05',
					show: 'cross-coast',
					source: {
						internetarchive: 'gb-2300-16398-IDJKE0C',
					},
				},
				IDBF5DWY: {
					id: 'IDBF5DWY',
					title: 'Double Dragon',
					description:
						"Ryan kicks off his movie tour with this...well...it's definitely a movie.",
					date: new Date('2009-02-11T00:00:00Z'),
					thumbnail:
						'https://archive.org/services/img/2009-02-11-This_Aint_No_Game-This_Aint_No_Game_Double_Dragon-IDBF5DWY',
					duration: '00:00:01',
					show: 'this-aint-no-game',
					source: {
						internetarchive: 'IDBF5DWY',
					},
				},
				IDIAQF2N: {
					id: 'IDIAQF2N',
					title: 'Street Fighter',
					description:
						"In honor of Street Fighter IV's release, we're sharing this epic piece of cinema.",
					date: new Date('2009-02-19T00:00:00Z'),
					thumbnail:
						'https://archive.org/services/img/2009-02-19-This_Aint_No_Game-This_Aint_No_Game_Street_Fighter-IDIAQF2N',
					duration: '--:--:--',
					show: 'this-aint-no-game',
					source: {
						internetarchive: 'IDIAQF2N',
					},
				},
				IDB90NXY: {
					id: 'IDB90NXY',
					title: 'Resident Evil',
					description: 'Ryan finds some love for the master of anti-dog karate.',
					date: new Date('2009-02-26T00:00:00Z'),
					thumbnail:
						'https://archive.org/services/img/2009-02-26-This_Aint_No_Game-This_Aint_No_Game_Resident_Evil-IDB90NXY',
					duration: '--:--:--',
					show: 'this-aint-no-game',
					source: {
						internetarchive: 'IDB90NXY',
					},
				},
			}

			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)

			expect(dataStore.people).toStrictEqual(expectedPeople)
			expect(dataStore.shows).toStrictEqual(expectedShows)
			expect(dataStore.videos).toStrictEqual(expectedVideos)
		})

		it('generates a video search index', () => {
			const expected = new Map(
				Object.entries({
					'2': new Map(Object.entries({ '2300-15259': 10 })),
					a: new Map(Object.entries({ IDBF5DWY: 5 })),
					abby: new Map(Object.entries({ '2300-16398': 5 })),
					abbys: new Map(Object.entries({ '2300-16398': 10 })),
					across: new Map(Object.entries({ '2300-15259': 1, '2300-16398': 1 })),
					aint: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					all: new Map(
						Object.entries({
							'2300-15259': 1,
							'2300-16398': 1,
						})
					),
					and: new Map(
						Object.entries({
							'2300-15259': 5,
							'2300-16398': 5,
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					anti: new Map(Object.entries({ IDB90NXY: 5 })),
					as: new Map(Object.entries({ '2300-16398': 5 })),
					but: new Map(Object.entries({ '2300-16398': 10 })),
					cinema: new Map(Object.entries({ IDIAQF2N: 5 })),
					coast: new Map(Object.entries({ '2300-15259': 10, '2300-16398': 10 })),
					country: new Map(
						Object.entries({
							'2300-15259': 1,
							'2300-16398': 1,
						})
					),
					cross: new Map(Object.entries({ '2300-15259': 10, '2300-16398': 10 })),
					dead: new Map(Object.entries({ '2300-15259': 10 })),
					definitely: new Map(Object.entries({ IDBF5DWY: 5 })),
					dog: new Map(Object.entries({ IDB90NXY: 5 })),
					double: new Map(
						Object.entries({
							IDBF5DWY: 10,
						})
					),
					dragon: new Map(
						Object.entries({
							IDBF5DWY: 10,
						})
					),
					epic: new Map(Object.entries({ IDIAQF2N: 5 })),
					eventually: new Map(Object.entries({ '2300-16398': 5 })),
					evil: new Map(Object.entries({ IDB90NXY: 10 })),
					fighter: new Map(
						Object.entries({
							IDIAQF2N: 10,
						})
					),
					finds: new Map(Object.entries({ IDB90NXY: 5 })),
					for: new Map(Object.entries({ IDB90NXY: 5 })),
					forces: new Map(
						Object.entries({
							'2300-15259': 1,
							'2300-16398': 1,
						})
					),
					full: new Map(Object.entries({ '2300-16398': 5 })),
					game: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					gestures: new Map(Object.entries({ '2300-16398': 5 })),
					goodbye: new Map(Object.entries({ '2300-16398': 10 })),
					hand: new Map(Object.entries({ '2300-16398': 5 })),
					his: new Map(Object.entries({ IDBF5DWY: 5 })),
					honor: new Map(Object.entries({ IDIAQF2N: 5 })),
					in: new Map(Object.entries({ '2300-15259': 5, IDIAQF2N: 5 })),
					into: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					its: new Map(Object.entries({ IDBF5DWY: 5 })),
					ivs: new Map(Object.entries({ IDIAQF2N: 5 })),
					join: new Map(
						Object.entries({
							'2300-15259': 1,
							'2300-16398': 5,
						})
					),
					karate: new Map(Object.entries({ IDB90NXY: 5 })),
					kicks: new Map(Object.entries({ IDBF5DWY: 5 })),
					later: new Map(Object.entries({ '2300-16398': 10 })),
					lets: new Map(Object.entries({ '2300-15259': 5 })),
					look: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					love: new Map(Object.entries({ IDB90NXY: 5 })),
					master: new Map(Object.entries({ IDB90NXY: 5 })),
					movie: new Map(Object.entries({ IDBF5DWY: 5 })),
					movies: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					new: new Map(Object.entries({ '2300-15259': 5 })),
					no: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					not: new Map(Object.entries({ '2300-16398': 10 })),
					obstacles: new Map(
						Object.entries({
							'2300-15259': 1,
							'2300-16398': 1,
						})
					),
					of: new Map(
						Object.entries({
							'2300-15259': 5,
							IDBF5DWY: 1,
							IDIAQF2N: 5,
							IDB90NXY: 5,
						})
					),
					off: new Map(Object.entries({ IDBF5DWY: 5 })),
					one: new Map(Object.entries({ '2300-16398': 5 })),
					overcome: new Map(
						Object.entries({
							'2300-15259': 1,
							'2300-16398': 1,
						})
					),
					piece: new Map(Object.entries({ IDIAQF2N: 5 })),
					posse: new Map(Object.entries({ '2300-15259': 5 })),
					questionable: new Map(Object.entries({ '2300-16398': 5 })),
					red: new Map(Object.entries({ '2300-15259': 10 })),
					redemption: new Map(Object.entries({ '2300-15259': 10 })),
					release: new Map(Object.entries({ IDIAQF2N: 5 })),
					resident: new Map(
						Object.entries({
							IDB90NXY: 10,
						})
					),
					ryan: new Map(
						Object.entries({
							IDBF5DWY: 5,
							IDB90NXY: 5,
						})
					),
					see: new Map(Object.entries({ '2300-15259': 5, '2300-16398': 10 })),
					stream: new Map(Object.entries({ '2300-16398': 10 })),
					sentences: new Map(Object.entries({ '2300-16398': 5 })),
					sharing: new Map(Object.entries({ IDIAQF2N: 5 })),
					some: new Map(Object.entries({ IDB90NXY: 5 })),
					street: new Map(
						Object.entries({
							IDIAQF2N: 10,
						})
					),
					the: new Map(
						Object.entries({
							'2300-15259': 5,
							'2300-16398': 1,
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 5,
						})
					),
					themes: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					this: new Map(
						Object.entries({
							IDBF5DWY: 5,
							IDIAQF2N: 5,
							IDB90NXY: 1,
						})
					),
					to: new Map(
						Object.entries({
							'2300-15259': 1,
							'2300-16398': 1,
						})
					),
					tour: new Map(Object.entries({ IDBF5DWY: 5 })),
					universe: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					up: new Map(Object.entries({ '2300-15259': 5 })),
					us: new Map(Object.entries({ '2300-16398': 5 })),
					using: new Map(Object.entries({ '2300-16398': 5 })),
					video: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					we: new Map(Object.entries({ '2300-15259': 1, '2300-16398': 5 })),
					well: new Map(Object.entries({ '2300-16398': 5, IDBF5DWY: 5 })),
					were: new Map(Object.entries({ IDIAQF2N: 5 })),
					whats: new Map(Object.entries({ '2300-15259': 5 })),
					wish: new Map(Object.entries({ '2300-16398': 5 })),
					with: new Map(
						Object.entries({
							IDBF5DWY: 5,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					wonderful: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					word: new Map(Object.entries({ '2300-16398': 5 })),
					world: new Map(
						Object.entries({
							'2300-15259': 5,
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
					you: new Map(Object.entries({ '2300-16398': 10 })),
					your: new Map(
						Object.entries({
							IDBF5DWY: 1,
							IDIAQF2N: 1,
							IDB90NXY: 1,
						})
					),
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

	describe('getVideoByIAId', () => {
		it('gets a specific video by its IA ID', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getVideoByIAId('gb-2300-15259-IDJIYS2')

			expect(result).toStrictEqual(dataStore.videos['2300-15259'])
		})
	})

	describe('getVideoById', () => {
		it('gets a specific video', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getVideoById('IDIAQF2N')

			expect(result).toStrictEqual(dataStore.videos['IDIAQF2N'])
		})
	})

	describe('getVideosForDay', () => {
		it('gets a specific show', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getVideosForDay(new Date('2023-11-25T00:00:00Z'))

			expect(result.map((x) => x.id)).toStrictEqual(['2300-16398'])
		})
	})

	describe('getVideos', () => {
		it('gets all videos', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getVideos()

			expect(result.map((x) => x.id)).toStrictEqual([
				'2300-16398',
				'2300-15259',
				'IDB90NXY',
				'IDIAQF2N',
				'IDBF5DWY',
			])
		})
	})

	describe('getVideosForShow', () => {
		it('gets a specific show', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.getVideosForShow(dataStore.shows['cross-coast'])

			expect(result.map((x) => x.id)).toStrictEqual(['2300-16398', '2300-15259'])
		})
	})

	describe('searchVideos', () => {
		it('gets a specific video', () => {
			const dataStore = new DataStore(testPeopleData, testShowData, testVideoData)
			const result = dataStore.searchVideos('evil')

			expect(result.map((x) => x.id)).toStrictEqual(['IDB90NXY'])
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
