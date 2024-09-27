import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {GamesService} from "../../shared/services/games.service";
import moment from "moment/moment";
import {map} from "rxjs";
import {Games} from "../../shared/models/games.interface";

export const homeResolver: ResolveFn<any> = (route, state) => {
    const gamesService = inject(GamesService);

  const firstYearDay = moment().startOf('year').format('YYYY-MM-DD');
  const lastYearDay = moment().add(1, 'year').endOf('year').format('YYYY-MM-DD');
  const dates = `${firstYearDay},${lastYearDay}`;
 const games = gamesService.getLastReleasedGames(1, dates).pipe(
    map((games) => {
      return gamesService.newGames.next(games)
    })
  );
  return games
};
