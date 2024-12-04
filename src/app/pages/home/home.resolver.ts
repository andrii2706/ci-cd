import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GamesService } from '../../shared/services/games.service';
import moment from 'moment/moment';
import { tap } from 'rxjs';
import { LoaderService } from '../../shared/services/loader.service';

/* eslint-disable  @typescript-eslint/no-explicit-any */

/* eslint-disable  @typescript-eslint/no-unused-vars */
export const homeResolver: ResolveFn<any> = (route, state) => {
	const gamesService = inject(GamesService);
	const loaderService = inject(LoaderService);

	const firstYearDay = moment().startOf('year').format('YYYY-MM-DD');
	const lastYearDay = moment()
		.add(1, 'year')
		.endOf('year')
		.format('YYYY-MM-DD');
	const dates = `${firstYearDay},${lastYearDay}`;
  return gamesService.getLastReleasedGames(1, dates).pipe(
    tap(games => gamesService.newGames.next(games))
  );
};
