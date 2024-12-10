import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GamesService } from '../../shared/services/games.service';
import moment from 'moment/moment';
import { finalize, tap } from 'rxjs';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Games } from '../../shared/models/games.interface';
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
export const homeResolver: ResolveFn<Games> = (route, state) => {
	const gamesService = inject(GamesService);
	const spinnerService = inject(SpinnerService);

	const firstYearDay = moment().startOf('year').format('YYYY-MM-DD');
	const lastYearDay = moment()
		.add(1, 'year')
		.endOf('year')
		.format('YYYY-MM-DD');
	const dates = `${firstYearDay},${lastYearDay}`;
	return gamesService.getLastReleasedGames(1, dates).pipe(
		tap(games => {
			gamesService.newGames.next(games);
		}),
		finalize(() => spinnerService.proceedSpinnerStatus(false))
	);
};
