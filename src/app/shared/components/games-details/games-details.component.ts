import { Component } from '@angular/core';
import { take } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameDetails } from '../../models/games.interface';
import { AppMaterialModule } from '../../../app-material/app-material.module';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-games-details',
  standalone: true,
  imports: [AppMaterialModule, SpinnerComponent],
  templateUrl: './games-details.component.html',
  styleUrl: './games-details.component.scss',
})
export class GamesDetailsComponent {
  isLoading = false;
  gameDetails: GameDetails;
  games: GameDetails[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private gamesService: GamesService,
    private snackbar: MatSnackBar,
  ) {
    this.activatedRoute.params.pipe(take(1)).subscribe(
      ({ id }) => {
        this.gameDetailsById(id);
      },
      () => {
        this.isLoading = true;
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: 'Server is out',
          verticalPosition: 'top',
          horizontalPosition: 'end',
        });
      },
    );
  }
  gameDetailsById(id: string) {
    this.gamesService
      .getGameByIdFromBE(id)
      .pipe(take(1))
      .subscribe((gameDetails) => {
        this.gameDetails = gameDetails;
      });
  }

  backButton() {
    history.back();
  }
}
