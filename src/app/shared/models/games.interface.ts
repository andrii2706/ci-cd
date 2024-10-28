export interface Games {
	count: number;
	next: string | null;
	previous: string | null;
	results: Game[];
	seo_title: string;
	seo_h1: string;
}

interface Platforms {
	platform: {
		id: number;
		name: string;
		slug: string;
		image: string | null;
		year_end: number | null;
		year_start: number | null;
		games_count: number;
		image_background: string;
	};
}

export interface Game {
	id: number;
	slug: string;
	name: string;
	isBought?: boolean;
	name_original: string;
	description: string;
	released: string;
	background_image: string;
	tba: boolean;
	rating: number;
	rating_top: number;
	metacritic: number;
	platforms: Platforms[];
}

export interface GameDetails {
	id: number;
	slug: string;
	name: string;
	name_original: string;
	description: string;
	developers: [
		{
			id: number;
			name: string;
			slug: string;
			games_count: number;
			image_background: string;
		},
	];
	metacritic: number;
	metacritic_platforms: [
		{
			metascore: number;
			url: string;
			platform: {
				name: string;
			};
		},
	];
	released: string;
	tba: boolean;
	updated: string;
	background_image: string;
	background_image_additional: string;
	website: string;
	rating: number;
	rating_top: number;
	ratings: [
		{
			id: number;
			title: string;
			count: number;
			percent: number;
		},
	];
	//TODO change to index interface (look into DAE)
	reactions: {
		'1': number;
		'2': number;
		'3': number;
		'4': number;
		'5': number;
		'6': number;
		'7': number;
		'8': number;
		'9': number;
		'10': number;
		'11': number;
		'12': number;
		'14': number;
		'15': number;
		'16': number;
		'18': number;
		'20': number;
		'21': number;
	};
	platforms: [
		{
			platform: {
				id: number;
				name: string;
				slug: string;
				image: string;
				year_end: string;
				year_start: string;
				games_count: number;
				image_background: string;
			};
			requirements_en: {
				minimum: string;
				recommended: string;
			};
		},
	];
	genres: [
		{
			id: number;
			name: string;
			slug: string;
			image_background: string;
		},
	];
	stores: [
		{
			id: number;
			store: {
				id: number;
				name: string;
				slug: string;
				domain: string;
				image_background: string;
			};
		},
	];
	tags: [
		{
			id: number;
			name: string;
			slug: string;
			language: string;
			image_background: string;
			games_count: number;
		},
	];
}

export interface ScreenShots {
	count: number;
	next: null;
	previous: null;
	results: [
		{
			id: number;
			image: string;
			is_deleted: boolean;
		},
	];
}

export interface ScreenShot {
	id: number;
	image: string;
	is_deleted: boolean;
}

export interface GameTrailers {
	count: number;
	next: null;
	previous: null;
	results: [
		{
			id: number;
			name: string;
			preview: string;
			date: {
				480: string;
				max: string;
			};
		},
	];
}

export interface GameTrailer {
	id: number;
	name: string;
	preview: string;
	date: object;
}

export interface IAchivments {
	count: number;
	next: null;
	previous: null;
	results: [
		{
			id: number;
			name: string;
			description: string;
			image: string;
			percent: string;
		},
	];
}

export interface FilterParams {
	search: string;
	platforms: string;
	ordering: string;
	metacritic: string;
	developers: string;
	dates: string;
}
