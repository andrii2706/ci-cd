export interface FilterParams {
	search: string;
	platforms?: string;
	ordering?: string;
	metacritic?: string;
	developers?: string;
	dates?: string;
	genres?: string;
}

export interface Genres {
	count: number;
	next: string;
	prev: string;
	results: Genre[];
}

export interface Genre {
	id: number;
	name: string;
	slug: string;
	games_count: number;
}

export interface Developers {
	count: number;
	next: string;
	prev: string;
	results: Developer[];
}

export interface Developer {
	id: number;
	name: string;
	slug: string;
	games_count: number;
}

export interface GenresFilters {
	genreName: string;
	slug: string;
}

export interface DevelopersFilters {
	developersName: string;
	slug: string;
}

export interface PlatformsFilters {
	platformsName: string;
	slug: string;
}

export interface OrderByInfos {
	name: string;
	slug: string;
}

export interface Metacritics {
	name: string;
	slug: string;
}
