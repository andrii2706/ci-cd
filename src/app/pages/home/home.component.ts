import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppMaterialModule} from "../../app-material/app-material.module";
import {GamesCardsComponent} from "../../shared/components/games-cards/games-cards.component";
import {GamesService} from "../../shared/services/games.service";
import {NgxPaginationModule} from "ngx-pagination";
import {Game} from "../../shared/models/games.interface";
import {noop} from "rxjs";
import moment from "moment";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppMaterialModule, GamesCardsComponent, NgxPaginationModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  private page = 1;
  private boughtGames: Game[] = [];

  games: Game[] = []
  total: number;
  dates: string;

  constructor(private gamesService: GamesService , private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getNewGames(this.page)
  }

  //TODO move to reducer
  getNewGames(page: number){
    const firstYearDay = moment().startOf('year').format('YYYY-MM-DD');
    const lastYearDay = moment().add(1, 'year').endOf('year').format('YYYY-MM-DD');
    this.dates = `${firstYearDay},${lastYearDay}`;
    this.gamesService.getLastReleasedGames(page, this.dates).subscribe((games) => {
       this.total = games.count;
      this.games = games.results;
    });
  }

  buyGame(game: Game){
    const userInfo = localStorage.getItem('user')
    if(userInfo && userInfo.length){
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
