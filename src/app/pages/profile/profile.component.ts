import { Component, OnInit, signal } from '@angular/core';
import { ClearObservableDirective } from '../../shared/classes';
import { GamesService } from '../../shared/services/games.service';
import { Game } from '../../shared/models/games.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import firebase from 'firebase/compat/app';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { SpinnerService } from '../../shared/services/spinner.service';
import { filter, takeUntil } from 'rxjs';
import User = firebase.User;
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss', '../../shared/styles/shared.scss'],
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
	isLoading = false;

	constructor(
		private gamesService: GamesService,
		private authService: AuthService,
		private dialog: MatDialog,
		private snackbarService: SnackbarService,
		private spinnerService: SpinnerService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		super();
	}

	ngOnInit() {
		this.getUser();
		this.initUpdateForm();
		this.clearGamesArr();
	}

	getUser() {
		this.authService.user$
			.pipe(
				takeUntil(this.destroy$),
				filter(user => user)
			)
			.subscribe(user => {
				this.user = user;
				this.gamesService.getGameById(user.uid).then(userGames => {
					this.userGames = userGames.games;
				});
				this.spinnerService.proceedSpinnerStatus(true);
				this.authService.getAvatarById(user.uid).then(avatar => {
					if (avatar.photoUrl) {
						this.userAvatar = avatar.photoUrl;
					}
					this.spinnerService.proceedSpinnerStatus(false);
				});
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
			if (status && this.user) {
				this.spinnerService.proceedSpinnerStatus(true);
				if (localStorage.getItem('user') !== null) {
					const user = JSON.parse(localStorage.getItem('user') as string);
					if (user) {
						const userGames: Game[] = user.games;
						user.games = userGames.filter(
							userInfo => userInfo.id !== gameInfo.id
						);
						localStorage.setItem('user', JSON.stringify(user));
					}
				}
				this.removeGamesFromProfile(this.user.uid, gameInfo);
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
		} catch {
			this.snackbarService.error(
				{ text: 'Error updating user info', status: 'error' },
				'top',
				'center',
				5000
			);
		}
	}

	deleteAllGames(userId: string) {
		this.gamesService.clearAllGamesFromUser(userId).then(() => {
			this.clearGamesArr();
			this.userGames = [];
		});
	}

	removeGamesFromProfile(uid: string, gameInfo: Game) {
		this.gamesService.removeGameFromUser(uid, gameInfo).then(() => {
			if (this.user) {
				this.gamesService.getGameById(uid).then(userGames => {
					this.userGames = userGames.games;
				});
			}
			this.spinnerService.proceedSpinnerStatus(false);
		});
	}

	private clearGamesArr() {
		if (this.userGames.length === 0 && localStorage.getItem('user') !== null) {
			const user = JSON.parse(localStorage.getItem('user') as string);
			if (user) {
				user.games = [];
				localStorage.setItem('user', JSON.stringify(user));
			}
		}
	}
}
