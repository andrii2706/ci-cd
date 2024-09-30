import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {GamesService} from "../../shared/services/games.service";
import {map} from "rxjs";


/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-unused-vars */
export const gamesResolver: ResolveFn<any> = (route, state) => {
  const gamesService = inject(GamesService);

  const games = gamesService.getAllGames(1).pipe(
    map((games) => {
      return gamesService.gamesData.next(games)
    })
  );
  return games
};
