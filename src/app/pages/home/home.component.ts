import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppMaterialModule} from "../../app-material/app-material.module";
import {GamesCardsComponent} from "../../shared/components/games-cards/games-cards.component";
import {GamesService} from "../../shared/services/games.service";
import {NgxPaginationModule} from "ngx-pagination";
import {Game, Games} from "../../shared/models/games.interface";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppMaterialModule, GamesCardsComponent, NgxPaginationModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  private page = 1;
  games: Game[] = []
  total: number;

  constructor(private gamesService: GamesService , private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {

  }
  getNewGames(page: number){
    this.gamesService.getLastReleasedGames(page, '26.09.2024').subscribe((games) => {
       this.total = games.count;
      this.games = games.results;
    });
  }



  navigateTo(PageNumber: number) {
    this.page = PageNumber;
    this.getNewGames(PageNumber);
  }

}
