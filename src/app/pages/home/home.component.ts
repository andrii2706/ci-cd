import {Component, OnInit} from '@angular/core';
import {AppMaterialModule} from "../../app-material/app-material.module";
import {GamesCardsComponent} from "../../shared/components/games-cards/games-cards.component";
import {GamesService} from "../../shared/services/games.service";
import {NgxPaginationModule} from "ngx-pagination";
import {Game} from "../../shared/models/games.interface";
import {noop} from "rxjs";
import moment from "moment";
import {ActivatedRoute} from "@angular/router";
import {SpinnerComponent} from "../../shared/components/spinner/spinner.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppMaterialModule, GamesCardsComponent, NgxPaginationModule, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  page = 1;
  private boughtGames: Game[] = [];

  games: Game[] = []
  total: number;
  dates: string;
  isLoading: boolean;

  constructor(private gamesService: GamesService, private router: ActivatedRoute) {
  }

  ngOnInit() {
    this.isLoading = true
    this.gamesService.newGames.subscribe(games => {
      if (games) {
        this.total = games.count;
        this.games = games.results;
      }
      this.isLoading = false
    })
  }

  getNewGames(page: number) {
    const firstYearDay = moment().startOf('year').format('YYYY-MM-DD');
    const lastYearDay = moment().add(1, 'year').endOf('year').format('YYYY-MM-DD');
    this.dates = `${firstYearDay},${lastYearDay}`;
    this.gamesService.getLastReleasedGames(page, this.dates).subscribe((games) => {
      this.total = games.count;
      this.games = games.results;
    });
  }

  buyGame(game: Game) {
    this.boughtGames.push(game);
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
    this.getNewGames(PageNumber);
  }

}
