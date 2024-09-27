import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Game} from "../../models/games.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {AppMaterialModule} from "../../../app-material/app-material.module";
import {ReplaceNullImgPipe} from "../../pipe/replace-null-img.pipe";
import {SnackbarComponent} from "../snackbar/snackbar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-games-cards',
  standalone: true,
  imports: [
    AppMaterialModule,
    ReplaceNullImgPipe
  ],
  templateUrl: './games-cards.component.html',
  styleUrl: './games-cards.component.scss'
})
export class GamesCardsComponent implements OnInit{

  @Input() set game(_game: Game){
    if(_game){
      this.gameInfo = _game
    }
  }
  @Input() set isGameBought(_isGameBought: boolean){
    this.showLabel = _isGameBought ? _isGameBought : false
  }

  @Output() boughtedGame = new EventEmitter<Game>()

  gameInfo: Game;
  showLabel: boolean;
  userStatus: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
     const userInfo =  JSON.stringify(localStorage.getItem('user'))
     this.userStatus = !!userInfo && !userInfo.length
    }

      buyGame(game: Game){
         this.boughtedGame.emit(game)
        this.showLabel = true
        if (this.showLabel)
          this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 900,
            data: {
              text: 'The game has been added to your list',
              status: 'success',
            },
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
      }


    goToGameDetails(){
      if (this.router.url === '/home') {
        void this.router.navigate([`/games/${this.game.id}`], {
          relativeTo: this.activatedRoute,
        });
      } else
        void this.router.navigate([this.game.id], {
          relativeTo: this.activatedRoute,
        });
    }

}
