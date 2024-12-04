import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GamesService } from '../../shared/services/games.service';
import { tap } from 'rxjs';

/* eslint-disable  @typescript-eslint/no-explicit-any */

/* eslint-disable  @typescript-eslint/no-unused-vars */
export const gamesResolver: ResolveFn<any> = (route, state) => {
	const gamesService = inject(GamesService);

	return gamesService.getAllGames(1).pipe(
		tap(games => {
			return gamesService.gamesData.next(games);
		})
	);
};
