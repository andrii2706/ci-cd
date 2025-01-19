import { Component } from '@angular/core';
import { forkJoin, take } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameDetails, GameTrailers } from '../../models/games.interface';
import { AppMaterialModule } from '../../../app-material/app-material.module';
import { SpinnerService } from '../../services/spinner.service';

@Component({
	selector: 'app-games-details',
	standalone: true,
	imports: [AppMaterialModule],
	templateUrl: './games-details.component.html',
	styleUrls: ['./games-details.component.scss', '../../styles/shared.scss'],
})
export class GamesDetailsComponent {
	gameDetails: GameDetails;
	gameTrailers: GameTrailers;
	games: GameDetails[];

	constructor(
		public activatedRoute: ActivatedRoute,
		public gamesService: GamesService,
		private spinnerService: SpinnerService,
		private snackbar: MatSnackBar
	) {
		this.activatedRoute.params.pipe(take(1)).subscribe(
			({ id }) => {
				this.gameDetailsById(id);
			},
			() => {
				this.spinnerService.proceedSpinnerStatus(true);
				this.snackbar.openFromComponent(SnackbarComponent, {
					data: 'Server is out',
					verticalPosition: 'top',
					horizontalPosition: 'end',
				});
			}
		);
	}

	gameDetailsById(id: string) {
		this.spinnerService.proceedSpinnerStatus(true);
		forkJoin({
			gameVideo: this.gamesService.getGameMovieById(id),
			gameDetails: this.gamesService.getGameByIdFromBE(id),
		}).subscribe(({ gameVideo, gameDetails }) => {
			this.gameTrailers = gameVideo;
			this.gameDetails = gameDetails;
			this.spinnerService.proceedSpinnerStatus(false);
		});
	}

	backButton() {
		history.back();
	}
}
