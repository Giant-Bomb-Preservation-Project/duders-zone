export interface Employee {
	name: string
	position?: string
	years: string
	image?: string
	links?: string[]
}

export enum ShowSorting {
	alphabetical,
	mostVideos,
}

export enum VideoListMode {
	List = 'list',
	Grid = 'grid',
}
