import {Component, OnInit} from '@angular/core';
import {ClearObservableDirective} from "../../shared/classes";
import {GamesService} from "../../shared/services/games.service";
import {Game} from "../../shared/models/games.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {UserInterface} from "../../shared/models/user.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends ClearObservableDirective implements OnInit {
  updateUserInfoForm: FormGroup;

  user: UserInterface;
  userGames: Game[] = [];
  isLoading: boolean;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  userAvatar: any;
  showAvatar = false;
  updateUserInfoStatus = false;
  private userId: string;


  constructor(private gamesService :GamesService, private router: Router, private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.getUser();
    this.initUpdateForm();
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
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  getFile(event: any) {
    this.userAvatar = event.target.files[0];
    const reader = new FileReader();
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.userAvatar = event.target.result;
    };
    this.showAvatar = !this.showAvatar;
  }

  initUpdateForm(){
    this.updateUserInfoForm = new FormGroup({
      displayName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  goToGame(id: number) {
    void this.router.navigate([`/games/${id}`], {
      relativeTo: this.activatedRoute,
    });
  }

  changeUserInfo(status: boolean){
    this.updateUserInfoStatus = status
  }


  removeGames(gameInfo: Game) {
    console.log(gameInfo)
  }

  submitUpdateUserForm() {
    console.log('hello')
  }
}
