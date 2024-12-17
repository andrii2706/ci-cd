import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from '../../models/games.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AppMaterialModule } from '../../../app-material/app-material.module';
import { ReplaceNullImgPipe } from '../../pipe/replace-null-img.pipe';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
	selector: 'app-games-cards',
	standalone: true,
	imports: [AppMaterialModule, ReplaceNullImgPipe, SpinnerComponent],
	templateUrl: './games-cards.component.html',
	styleUrls: ['./games-cards.component.scss', '../../styles/shared.scss'],
})
export class GamesCardsComponent implements OnInit {
	@Input() set game(_game: Game) {
		if (_game) {
			this.gameInfo = _game;
		}
	}

	@Output() boughtedGame = new EventEmitter<Game>();

	gameInfo: Game;
	showLabel: boolean;
	userStatus: boolean;

	@Input() set isGameBought(_isGameBought: Game[]) {
		_isGameBought.map(gameBoughted => {
			if (gameBoughted.id === this.gameInfo.id) {
				this.showLabel = true;
			}
		});
	}

	constructor(
		public router: Router,
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar
	) {}

	ngOnInit() {
		const userInfo = JSON.stringify(localStorage.getItem('user'));
		this.userStatus = !!userInfo && !userInfo.length;
	}

	buyGame(game: Game) {
		this.boughtedGame.emit(game);
		this.showLabel = true;
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

	goToGameDetails() {
		if (this.router.url === '/home') {
			void this.router.navigate([`/games/${this.gameInfo.id}`], {
				relativeTo: this.activatedRoute,
			});
		} else
			void this.router.navigate([this.gameInfo.id], {
				relativeTo: this.activatedRoute,
			});
	}
}
