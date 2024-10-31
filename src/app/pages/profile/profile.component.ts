import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClearObservableDirective } from '../../shared/classes';
import { GamesService } from '../../shared/services/games.service';
import { Game } from '../../shared/models/games.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { noop } from 'rxjs';
import firebase from 'firebase/compat/app';
import User = firebase.User;
import { FirebaseStorage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent
	extends ClearObservableDirective
	implements OnInit {
  updateUserInfoForm: FormGroup;

  user: User | null;
  userGames: Game[] = [];
  isLoading: boolean;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  userAvatar = '';
  showAvatar = false;
  updateUserInfoStatus = false;
  private userId: string;
  private storage: FirebaseStorage;

  constructor(
    private gamesService: GamesService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.getUser();
    this.initUpdateForm();
  }

  getUser() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.gamesService.getGameById(user.uid).then(userGames => {
          this.userGames = userGames.games;
        });
        this.authService.getAvatarById(user.uid).then(avatar => {
          this.userAvatar = avatar;
        })
      }
    })
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

  initUpdateForm() {
    this.updateUserInfoForm = new FormGroup({
      displayName: new FormControl('', [Validators.required]),
      photoUrl: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  goToGame(id: number) {
    void this.router.navigate([`/games/${id}`], {
      relativeTo: this.activatedRoute,
    });
  }

  changeUserInfo(status: boolean) {
    this.updateUserInfoStatus = status;
  }

  removeGames(gameInfo: Game) {
    if (this.user) {
      this.gamesService.removeGameFromUser(this.user.uid, gameInfo).then(() => {
        this.gamesService.getGameById(this.userId).then(userGames => {
          this.userGames = userGames.games;
        });
      });
    }
  }


  async submitUpdateUserForm() {
    try {
      this.authService.updateUserInfo(this.updateUserInfoForm.get('displayName')?.value, this.updateUserInfoForm.get('email')?.value, this.userAvatar)
      console.log('User info updated successfully');
    } catch (error) {
      console.error('Error updating user info', error);
    }
  }
}
