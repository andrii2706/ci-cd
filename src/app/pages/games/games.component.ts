import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GamesService } from '../../shared/services/games.service';
import { Game } from '../../shared/models/games.interface';
import { finalize, noop, takeUntil } from 'rxjs';
import { FilterParams } from '../../shared/models/filter.interface';
import { ClearObservableDirective } from '../../shared/classes';
import { ErrorService } from '../../shared/services/error.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss', '../../shared/styles/shared.scss']
})
export class GamesComponent extends ClearObservableDirective implements OnInit {
	page = 1;
	games: Game[] | undefined = [];
	total: string | number;
	boughtGames: Game[] = [];
	filterParams: FilterParams | null;
	totalGames: number | undefined;
	isGameBoughtStatus: Game[] = [];

	constructor(
		private cdr: ChangeDetectorRef,
		private gamesService: GamesService,
		private spinnerService: SpinnerService,
		private route: ActivatedRoute,
		private errorService: ErrorService
	) {
		super();
	}

	ngOnInit() {
		if (this.route.snapshot?.data['games'].results.length) {
			this.games = this.route.snapshot?.data['games'].results;
			this.total = this.route.snapshot?.data['games'].count;
		}
		this.isGameBought();
	}

	getGames(page: number) {
		this.gamesService
			.getAllGames(page)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				games => {
					this.games = games.results;
					this.errorService.fullErrorObject(false);
					this.spinnerService.proceedSpinnerStatus(true);
					this.cdr.detectChanges();
				},
				error => {
					if (error) {
						this.errorService.fullErrorObject(true);
						this.spinnerService.proceedSpinnerStatus(false);
					}
				}
			);
	}

	buyGame(game: Game) {
		this.boughtGames.push(game);
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
					this.isGameBoughtStatus = games.games?.filter(
						(game: Game, index: number) => game.id === gamesId[index]
					);
				}
			});
		}
	}

	navigateTo(PageNumber: number) {
		this.page = PageNumber;
		if (this.filterParams) {
			this.filteredGames(PageNumber, this.filterParams);
		} else {
			this.getGames(PageNumber);
		}
	}

	getFilterQuery(fp: FilterParams) {
		this.spinnerService.proceedSpinnerStatus(true);
		this.filterParams = fp;
		if (
			this.filterParams.search === '' &&
			this.filterParams.genres === '' &&
			this.filterParams.platforms === '' &&
			this.filterParams.developers === '' &&
			this.filterParams.ordering === '' &&
			this.filterParams.dates === '' &&
			this.filterParams.metacritic === ''
		) {
			return this.getGames(1);
		} else {
			return this.filteredGames(1, this.filterParams);
		}
		this.spinnerService.proceedSpinnerStatus(false);
		this.cdr.detectChanges();
	}

	filteredGames(page: number, filter: FilterParams) {
		this.spinnerService.proceedSpinnerStatus(true);
		this.gamesService
			.filterGames(page, filter)
			.pipe(
				takeUntil(this.destroy$),
				finalize(() => {
					this.spinnerService.proceedSpinnerStatus(false);
				})
			)
			.subscribe(
				games => {
					this.totalGames = games.count;
					this.games = games.results;
					this.errorService.fullErrorObject(false);
					this.cdr.detectChanges();
				},
				error => {
					if (error) {
						this.errorService.fullErrorObject(true);
					}
				}
			);
	}
}
