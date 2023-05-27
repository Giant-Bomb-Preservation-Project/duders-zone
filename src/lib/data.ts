export interface Video {
	id: string,
	title: string,
	description: string,
	image: string,
	publicationDate: Date,
}

export const quickLookVideos: Video[] = [
	{
		id: 'gb-2300-9680-IDLAE9D',
		title: 'Mario Party Party: 2',
		description: "It's another fifty turns of delight and wonderment and you're all invited!",
		image: 'https://ia601609.us.archive.org/5/items/gb-2300-9680-IDLAE9D/gb-2300-9680-IDLAE9D.thumbs%2F2014-11-06-Mario_Party_Party-Mario_Party_Party_2_000114.jpg',
		publicationDate: new Date('2014-11-06'),
	},
	{
		id: '2019-03-16-Demo_Derby-Demo_Derby_PlayStation_Jampack_-_Summer_of_1999-IDPTSFZS',
		title: 'Demo Derby: PlayStation Jampack - Summer of 1999',
		description: "Ben, Jeff, and Brad find out just how much fun can be packed into one disk. ",
		image: 'https://ia804700.us.archive.org/11/items/2019-03-16-Demo_Derby-Demo_Derby_PlayStation_Jampack_-_Summer_of_1999-IDPTSFZS/2019-03-16-Demo_Derby-Demo_Derby_PlayStation_Jampack_-_Summer_of_1999-IDPTSFZS.thumbs%2F2019-03-16-Demo_Derby-Demo_Derby_PlayStation_Jampack_-_Summer_of_1999_000114.jpg',
		publicationDate: new Date('2019-03-16'),
	},
	{
		id: '2009-06-18-This_Aint_No_Game-This_Aint_No_Game_TANG_Super_Mario_Bros-IDPBF0S0',
		title: "This Ain't No Game: TANG: Super Mario Bros.",
		description: 'One of the most requested movies goes under the microscope.',
		image: 'https://ia804708.us.archive.org/7/items/2009-06-18-This_Aint_No_Game-This_Aint_No_Game_TANG_Super_Mario_Bros-IDPBF0S0/2009-06-18-This_Aint_No_Game-This_Aint_No_Game_TANG_Super_Mario_Bros-IDPBF0S0.thumbs%2F2009-06-18-This_Aint_No_Game-This_Aint_No_Game_TANG_Super_Mario_Bros_000057.jpg',
		publicationDate: new Date('2009-06-18'),
	},
	{
		id: 'gb-2300-10015',
		title: 'Metal Gear Scanlon: 3: Part 05',
		description: "We're still lost so let's just put on some stinky camo and get crocked.",
		image: 'https://ia801607.us.archive.org/15/items/gb-2300-10015/gb-2300-10015.thumbs%2F2015-03-12-Metal_Gear_Scanlon-Metal_Gear_Scanlon_3_Part_05_000114.jpg',
		publicationDate: new Date('2015-03-12'),
	},
	{
		id: 'gb-2300-5994-IDUIFFJ',
		title: "Quick Look: Dragon's Lair",
		description: 'Arcade game makers learned early: put the suggestive cartoon content AFTER the impossible knight puzzle.',
		image: 'https://ia601602.us.archive.org/25/items/gb-2300-5994-IDUIFFJ/gb-2300-5994-IDUIFFJ.thumbs%2F2012-05-22-Quick_Looks-Quick_Look_Dragons_Lair_000114.jpg',
		publicationDate: new Date('2012-05-22'),
	},
];

export const thisDayVideos: Video[] = [
	{
		id: '2019-03-16-Demo_Derby-Demo_Derby_PlayStation_Jampack_-_Summer_of_1999-IDPTSFZS',
		title: 'Demo Derby: PlayStation Jampack - Summer of 1999',
		description: "Ben, Jeff, and Brad find out just how much fun can be packed into one disk. ",
		image: 'https://ia804700.us.archive.org/11/items/2019-03-16-Demo_Derby-Demo_Derby_PlayStation_Jampack_-_Summer_of_1999-IDPTSFZS/2019-03-16-Demo_Derby-Demo_Derby_PlayStation_Jampack_-_Summer_of_1999-IDPTSFZS.thumbs%2F2019-03-16-Demo_Derby-Demo_Derby_PlayStation_Jampack_-_Summer_of_1999_000114.jpg',
		publicationDate: new Date('2019-03-16'),
	},
	{
		id: 'gb-2300-9680-IDLAE9D',
		title: 'Mario Party Party: 2',
		description: "It's another fifty turns of delight and wonderment and you're all invited!",
		image: 'https://ia601609.us.archive.org/5/items/gb-2300-9680-IDLAE9D/gb-2300-9680-IDLAE9D.thumbs%2F2014-11-06-Mario_Party_Party-Mario_Party_Party_2_000114.jpg',
		publicationDate: new Date('2014-11-06'),
	},
	{
		id: 'gb-2300-5994-IDUIFFJ',
		title: "Quick Look: Dragon's Lair",
		description: 'Arcade game makers learned early: put the suggestive cartoon content AFTER the impossible knight puzzle.',
		image: 'https://ia601602.us.archive.org/25/items/gb-2300-5994-IDUIFFJ/gb-2300-5994-IDUIFFJ.thumbs%2F2012-05-22-Quick_Looks-Quick_Look_Dragons_Lair_000114.jpg',
		publicationDate: new Date('2012-05-22'),
	},
	{
		id: '2009-06-18-This_Aint_No_Game-This_Aint_No_Game_TANG_Super_Mario_Bros-IDPBF0S0',
		title: "This Ain't No Game: TANG: Super Mario Bros.",
		description: 'One of the most requested movies goes under the microscope.',
		image: 'https://ia804708.us.archive.org/7/items/2009-06-18-This_Aint_No_Game-This_Aint_No_Game_TANG_Super_Mario_Bros-IDPBF0S0/2009-06-18-This_Aint_No_Game-This_Aint_No_Game_TANG_Super_Mario_Bros-IDPBF0S0.thumbs%2F2009-06-18-This_Aint_No_Game-This_Aint_No_Game_TANG_Super_Mario_Bros_000057.jpg',
		publicationDate: new Date('2009-06-18'),
	},
	{
		id: 'gb-2300-10015',
		title: 'Metal Gear Scanlon: 3: Part 05',
		description: "We're still lost so let's just put on some stinky camo and get crocked.",
		image: 'https://ia801607.us.archive.org/15/items/gb-2300-10015/gb-2300-10015.thumbs%2F2015-03-12-Metal_Gear_Scanlon-Metal_Gear_Scanlon_3_Part_05_000114.jpg',
		publicationDate: new Date('2015-03-12'),
	},
];
