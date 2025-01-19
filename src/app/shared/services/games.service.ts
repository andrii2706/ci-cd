import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
	FilterParams,
	Game,
	GameDetails,
	Games,
	GameTrailers,
} from '../models/games.interface';
import {
	arrayRemove,
	doc,
	Firestore,
	getDoc,
	updateDoc,
} from '@angular/fire/firestore';
import { environment } from '../../../environment/environment';
import { SnackbarService } from './snackbar.service';

@Injectable({
	providedIn: 'root',
})
export class GamesService {
	key = environment.rawgApiKey;
	url = environment.rawgApaUrl;
	games = '/games';

	newGames = new BehaviorSubject<Games | null>(null);
	gamesData = new BehaviorSubject<Games | null>(null);
	
	private newGames$: Observable<Games | null> = this.newGames.asObservable();
	private gamesData$: Observable<Games | null> = this.gamesData.asObservable();

	constructor(
		private httpClient: HttpClient,
		private snackbarService: SnackbarService,
		private fireStore: Firestore
	) {}

	getLastReleasedGames(page: number, dates: string): Observable<Games> {
		const query = (dates: string) =>
			new HttpParams({
				fromObject: {
					key: this.key,
					page,
					dates: dates,
				},
			});
		return this.httpClient.get<Games>(`${this.url}${this.games}`, {
			params: query(dates),
		});
	}

	getAllGames(page: number): Observable<Games> {
		const filterParam = () =>
			new HttpParams({
				fromObject: {
					key: this.key,
					page,
				},
			});

		return this.httpClient.get<Games>(`${this.url}${this.games}`, {
			params: filterParam(),
		});
	}

	filterGames(page: number, filterParams: FilterParams): Observable<Games> {
		const paramsForFilter = this.getFilterQueryParameter(filterParams);
		return this.httpClient.get<Games>(
			`${this.url}${this.games}?key=${this.key}&page=${page}`,
			{
				params: paramsForFilter,
			}
		);
	}

	getGameByIdFromBE(id: string): Observable<GameDetails> {
		const paramsForGameBtId = new HttpParams({
			fromObject: {
				key: this.key,
			},
		});
		return this.httpClient.get<GameDetails>(`${this.url}${this.games}/${id}`, {
			params: paramsForGameBtId,
		});
	}

	getGameMovieById(id: string): Observable<GameTrailers> {
		const paramsForGameBtId = new HttpParams({
			fromObject: {
				key: this.key,
			},
		});
		return this.httpClient.get<GameTrailers>(
			`${this.url}${this.games}/${id}/movies`,
			{
				params: paramsForGameBtId,
			}
		);
	}

	private getFilterQueryParameter(filterParams: FilterParams): HttpParams {
		return Object.entries(filterParams).reduce<HttpParams>((acc, item) => {
			const key = item[0];
			const value = item[1];
			if (value !== '') {
				return acc.append(key, value);
			}
			return acc;
		}, new HttpParams());
	}

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	async updateUserData(userId: string, newData: any) {
		const userRef = doc(this.fireStore, 'userGame', userId);
		try {
			await updateDoc(userRef, newData);
			this.snackbarService.success(
				 { text: `Game is added to bucket`, status: 'success' },
				 'top',
				 'center',
				5000
			);
		} catch {
			this.snackbarService.error(
				 { text: `Game is not added`, status: 'error' },
				 'top',
				 'center',
				5000
			);
		}
	}

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	async getGameById(id: string): Promise<any | undefined> {
		const gameDoc = doc(this.fireStore, 'userGame', id);
		const gameSnapshot = await getDoc(gameDoc);
		if (gameSnapshot.exists()) {
			return { id: +gameSnapshot.id, ...gameSnapshot.data() };
		} else {
			return null;
		}
	}

	async removeGameFromUser(userId: string, gameId: Game) {
		const userRef = doc(this.fireStore, 'userGame', userId);
		try {
			await updateDoc(userRef, {
				games: arrayRemove(gameId),
			});
			this.snackbarService.success(
				 { text: `Game is removed successfully`, status: 'success' },
				 'top',
				 'center',
				5000,
			);
		} catch {
			this.snackbarService.error(
				 { text: `Game is not deleted`, status: 'error' },
				 'top',
				 'center',
				5000,
			);
		}
	}

	async clearAllGamesFromUser(userId: string) {
		const userRef = doc(this.fireStore, 'userGame', userId);
		try {
			await updateDoc(userRef, {
				games: [],
			});
			this.snackbarService.success(
				 {
					text: `All games have been removed successfully`,
					status: 'success',
				},
				 'top',
				 'center',
				5000
			);
		} catch {
			this.snackbarService.error(
				 { text: `Failed to remove all games`, status: 'error' },
				 'top',
				 'center',
				5000,
			);
		}
	}
}
