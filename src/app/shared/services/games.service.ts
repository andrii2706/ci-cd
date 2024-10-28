import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterParams, GameDetails, Games } from '../models/games.interface';
import {
	arrayRemove,
	doc,
	Firestore,
	getDoc,
	updateDoc,
} from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root',
})
export class GamesService {
	key = '85d9905e7cd7443c8983e54b4733abf5';
	url = 'https://api.rawg.io/api';
	games = '/games';

	newGames = new BehaviorSubject<Games | null>(null);
	private newGames$: Observable<Games | null> = this.newGames.asObservable();
	gamesData = new BehaviorSubject<Games | null>(null);
	private gamesData$: Observable<Games | null> = this.gamesData.asObservable();

	constructor(
		private httpClient: HttpClient,
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
		console.log(userRef.id);
		try {
			await updateDoc(userRef, newData);
		} catch (error) {
			console.error('Помилка оновлення даних: ', error);
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

	async removeGameFromUser(userId: string, gameId: string) {
		const userRef = doc(this.fireStore, 'userGame', userId);
		try {
			await updateDoc(userRef, {
				games: arrayRemove(gameId),
			});
		} catch (error) {
			console.error('Помилка видалення гри з масиву: ', error);
		}
	}
}
