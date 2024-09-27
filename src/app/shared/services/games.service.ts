import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {FilterParams, Game, Games} from "../models/games.interface";
import {addDoc, collection, Firestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  key = '85d9905e7cd7443c8983e54b4733abf5'
  url = 'https://api.rawg.io/api';
  games = '/games';

  newGames = new BehaviorSubject<Games | null>(null);
  private newGames$: Observable<Games | null> = this.newGames.asObservable();


  constructor(private httpClient: HttpClient, private fireStore: Firestore) { }

  getLastReleasedGames(page: number, dates: string): Observable<Games>{
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

  filterGames(page: number, filterParams: FilterParams): Observable<Games>{
    const paramsForFilter = this.getFilterQueryParameter(filterParams);
    return  this.httpClient.get<Games>(`${this.url}${this.games}?key=${this.key}&page=${page}`,
      {
        params: paramsForFilter,
      })
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

  async addGamesToUser(userId: string, games: Game[]){
    await addDoc(collection(this.fireStore , 'userGame'), {userId, games})
  }
}
