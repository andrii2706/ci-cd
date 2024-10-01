import {Component, OnInit} from '@angular/core';
import {ClearObservableDirective} from "../../shared/classes";
import {GamesService} from "../../shared/services/games.service";
import {Game} from "../../shared/models/games.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {UserInterface} from "../../shared/models/user.interface";



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends ClearObservableDirective implements OnInit {

  user: UserInterface;
  userGames: Game[] = [];
  isLoading: boolean;
  private userId: string;

  constructor(private gamesService :GamesService, private router: Router, private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.getUser();
  }

  getUser(){

    const localUserInfo = localStorage.getItem('user');
    if(localUserInfo){
      this.user = JSON.parse(localUserInfo).multiFactor.user
      if(this.user){
      this.userId = this.user.uid
        this.gamesService.getGameById(this.userId).then(userGames => {
          this.userGames = userGames.games;
        })
      }

    }
  }

  goToGame(id: number) {
    void this.router.navigate([`/games/${id}`], {
      relativeTo: this.activatedRoute,
    });
  }
    //TODO Add logic for remove
  // removeGames(gameInfo: Game) {
  //
  // }
}
