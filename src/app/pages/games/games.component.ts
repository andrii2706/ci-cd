import {Component, OnInit} from '@angular/core';
import {GamesService} from "../../shared/services/games.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import { Game} from "../../shared/models/games.interface";
import {finalize, noop, take} from "rxjs";
import { FilterParams } from '../../shared/models/filter.interface';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss'
})
export class GamesComponent implements OnInit {
  page = 1;
  games: Game[]
  total: string | number;
  isLoading: boolean
  boughtGames: Game[];
  filterParams: FilterParams;
  totalGames: number;

  constructor(private gamesService: GamesService) {
  }


  ngOnInit() {
    this.isLoading = false
    this.gamesService.gamesData.pipe(take(1)).subscribe(games => {
      if (games) {
        this.games = games?.results;
        this.total = games.count;
      }
      this.isLoading = true;
    })
  }

  getGames(page: number) {
    this.gamesService.getAllGames(page).pipe(take(1)).subscribe(games => {

    })
  }


  buyGame(game: Game) {
    this.boughtGames.push((game));
    const userInfo = localStorage.getItem('user')
    if (userInfo && userInfo.length) {
      const user = JSON.parse(userInfo)
      user.games.push(game)
      localStorage.setItem('user', JSON.stringify(user))
      this.gamesService.addGamesToUser(user.multiFactor.user.uid, this.boughtGames).then(() => noop());
    }
  }

  navigateTo(PageNumber: number) {
    this.page = PageNumber;
    if (this.filterParams) {
      this.filteredGames(PageNumber, this.filterParams);
    } else {
      this.getGames(PageNumber);
    }
  }

  getFilterQuery(fp: FilterParams) {
    this.filterParams = fp;
    if (
      this.filterParams.search === '' &&
      this.filterParams.genres === '' &&
      this.filterParams.platforms === '' &&
      this.filterParams.developers === '' &&
      this.filterParams.ordering === '' &&
      this.filterParams.dates === '' &&
      this.filterParams.metacritic === ''
    ) {
      return this.getGames(1);
    } else {
      return this.filteredGames(1, this.filterParams);
    }
  }

  filteredGames(page: number, filter: FilterParams) {
    this.isLoading = true;
    this.gamesService
      .filterGames(page, filter)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(games => {
        this.totalGames = games.count;
        this.games = games.results;
        this.isLoading = false;
      });
  }


}
