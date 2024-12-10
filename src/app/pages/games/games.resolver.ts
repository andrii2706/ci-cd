import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GamesService } from '../../shared/services/games.service';
import { tap } from 'rxjs';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Games } from '../../shared/models/games.interface';

/* eslint-disable  @typescript-eslint/no-explicit-any */

/* eslint-disable  @typescript-eslint/no-unused-vars */
export const gamesResolver: ResolveFn<Games> = (route, state) => {
	const gamesService = inject(GamesService);
	const spinnerService = inject(SpinnerService);

	return gamesService.getAllGames(1).pipe(
		tap(games => {
			spinnerService.proceedSpinnerStatus(false);
			return gamesService.gamesData.next(games);
		})
	);
};
