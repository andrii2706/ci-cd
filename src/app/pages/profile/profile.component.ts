import { Component, OnInit, signal } from '@angular/core';
import { ClearObservableDirective } from '../../shared/classes';
import { GamesService } from '../../shared/services/games.service';
import { Game } from '../../shared/models/games.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import firebase from 'firebase/compat/app';
import User = firebase.User;
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { SpinnerService } from '../../shared/services/spinner.service';
import { takeUntil } from 'rxjs';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent
	extends ClearObservableDirective
	implements OnInit
{
	updateUserInfoForm: FormGroup;
	confirmStatus = signal(null);
	user: User | null;
	userGames: Game[] = [];
	userAvatar = '';
	showAvatar = false;
	updateUserInfoStatus = false;

	constructor(
		private gamesService: GamesService,
		private authService: AuthService,
		private dialog: MatDialog,
    private snackbarComponent: MatSnackBar,
		private spinnerService: SpinnerService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		super();
	}

	ngOnInit() {
		this.getUser();
		this.initUpdateForm();
	}

	getUser() {
		this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
			if (user) {
				this.user = user;
				this.gamesService.getGameById(user.uid).then(userGames => {
					this.userGames = userGames.games;
				});
				this.authService.getAvatarById(user.uid).then(avatar => {
					this.userAvatar = avatar.photoUrl;
					this.spinnerService.proceedSpinnerStatus(false);
				});
			}
		});
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
		const dialogRef = this.dialog.open(ConfirmationComponent, {
			data: {
				confirm: this.confirmStatus(),
			},
			disableClose: true,
		});

		dialogRef.afterClosed().subscribe(status => {
			if (status) {
				if (this.user) {
					this.spinnerService.proceedSpinnerStatus(true);
					this.gamesService
						.removeGameFromUser(this.user.uid, gameInfo)
						.then(() => {
							if (this.user) {
								this.gamesService.getGameById(this.user.uid).then(userGames => {
									this.userGames = userGames.games;
								});
							}
							this.spinnerService.proceedSpinnerStatus(false);
						});
				}
			} else {
				dialogRef.close(false);
			}
		});
	}

	async submitUpdateUserForm() {
		this.spinnerService.proceedSpinnerStatus(true);
		try {
			this.authService.updateUserInfo(
				this.updateUserInfoForm.get('displayName')?.value,
				this.updateUserInfoForm.get('email')?.value,
				this.userAvatar
			);
			this.spinnerService.proceedSpinnerStatus(false);
      /* eslint-disable  @typescript-eslint/no-unused-vars */
		} catch (error) {
      this.snackbarComponent.openFromComponent(SnackbarComponent, {
        duration: 5000,
        data: { text: 'Error updating user info', status: 'error' },
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
		}
	}
}
