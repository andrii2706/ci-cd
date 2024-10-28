import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class GamesVideosService {
	constructor(private httpClient: HttpClient) {}

	key = environment.gameSpotApiKey;
	url = environment.gameSpotApiUrl;
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	getLastVideo(): Observable<any> {
		return this.httpClient.get(
			`${this.url}/?api_key=${this.key}&format=json&limit=10`,
			{
				headers: {},
			}
		);
	}
}
