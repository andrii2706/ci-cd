import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { GamesCardsComponent } from '../../shared/components/games-cards/games-cards.component';
import { GamesService } from '../../shared/services/games.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Game } from '../../shared/models/games.interface';
import { finalize, noop, takeUntil } from 'rxjs';
import moment from 'moment';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ClearObservableDirective } from '../../shared/classes';
import { ErrorService } from '../../shared/services/error.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		AppMaterialModule,
		GamesCardsComponent,
		NgxPaginationModule,
		SpinnerComponent,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent extends ClearObservableDirective implements OnInit {
	page = 1;
	games: Game[] | undefined = [];
	total: number | undefined;
	dates: string;
	isGameBoughtStatus = [];

	constructor(
		private gamesService: GamesService,
		private errorService: ErrorService,
		private spinnerService: SpinnerService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit() {
		if (this.route.snapshot.data['games'].results.length) {
			this.games = this.route.snapshot.data['games'].results;
			this.total = this.route.snapshot.data['games'].count;
			this.spinnerService.proceedSpinnerStatus(false);
		}
		this.isGameBought();
	}

	getNewGames(page: number) {
		const firstYearDay = moment().startOf('year').format('YYYY-MM-DD');
		const lastYearDay = moment()
			.add(1, 'year')
			.endOf('year')
			.format('YYYY-MM-DD');
		this.dates = `${firstYearDay},${lastYearDay}`;
		this.gamesService
			.getLastReleasedGames(page, this.dates)
			.pipe(
				takeUntil(this.destroy$),
				finalize(() => this.spinnerService.proceedSpinnerStatus(true))
			)
			.subscribe(
				games => {
					this.total = games.count;
					this.games = games.results;
					this.errorService.fullErrorObject(false);
				},
				error => {
					if (error) {
						this.errorService.fullErrorObject(true);
					}
				}
			);
	}

	buyGame(game: Game) {
		const userInfo = localStorage.getItem('user');
		if (userInfo && userInfo.length) {
			const user = JSON.parse(userInfo);
			user.games.push(game);
			localStorage.setItem('user', JSON.stringify(user));
			this.gamesService
				.updateUserData(user.multiFactor.user.uid, { games: user.games })
				.then(() => noop());
		}
		this.cdr.detectChanges();
	}

	isGameBought() {
		const userInfo = localStorage.getItem('user');
		if (userInfo && userInfo.length) {
			const user = JSON.parse(userInfo);
			this.gamesService.getGameById(user.multiFactor.user.uid).then(games => {
				if (games.games && games.games.length) {
					const gamesId = games.games.map((game: Game) => game.id);
					this.isGameBoughtStatus = games.games.filter(
						(game: Game, index: number) => game.id === gamesId[index]
					);
				}
			});
		}
	}

	navigateTo(PageNumber: number) {
		this.page = PageNumber;
		this.getNewGames(PageNumber);
	}
}
