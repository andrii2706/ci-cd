import { Component } from '@angular/core';
import { take } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameDetails, GameTrailers } from '../../models/games.interface';
import { AppMaterialModule } from '../../../app-material/app-material.module';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SpinnerService } from '../../services/spinner.service';

@Component({
	selector: 'app-games-details',
	standalone: true,
	imports: [AppMaterialModule, SpinnerComponent],
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
		this.gamesService.getGameMovieById(id).subscribe(gameVideo => {
			this.gameTrailers = gameVideo;
		});
		this.gamesService
			.getGameByIdFromBE(id)
			.pipe(take(1))
			.subscribe(gameDetails => {
				this.gameDetails = gameDetails;
			});
	}

	backButton() {
		history.back();
	}
}
