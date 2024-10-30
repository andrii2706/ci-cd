import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GamesService } from '../../shared/services/games.service';
import { Game } from '../../shared/models/games.interface';
import { finalize, noop, take, takeUntil } from 'rxjs';
import { FilterParams } from '../../shared/models/filter.interface';
import { ClearObservableDirective } from '../../shared/classes';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrl: './games.component.scss',
})
export class GamesComponent extends ClearObservableDirective implements OnInit {
	page = 1;
	games: Game[] = [];
	total: string | number;
	isLoading: boolean;
	boughtGames: Game[] = [];
	filterParams: FilterParams;
	totalGames: number;
	isGameBoughtStatus: Game[] = [];

	constructor(
		private cdr: ChangeDetectorRef,
		private gamesService: GamesService
	) {
		super();
	}

	ngOnInit() {
		this.isLoading = true;
		this.gamesService.gamesData.pipe(take(1)).subscribe(games => {
			if (games) {
				this.games = games?.results;
				this.total = games.count;
			}
			this.isLoading = false;
		});
		this.isGameBought();
	}

	getGames(page: number) {
		this.gamesService
			.getAllGames(page)
			.pipe(takeUntil(this.destroy$))
			.subscribe(games => {
				this.games = games.results;
				this.cdr.detectChanges();
			});
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
		this.isLoading = true;
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
			this.isLoading = false;
			this.cdr.detectChanges();
			return this.getGames(1);
		} else {
			this.isLoading = false;
			this.cdr.detectChanges();
			return this.filteredGames(1, this.filterParams);
		}
	}

	filteredGames(page: number, filter: FilterParams) {
		this.isLoading = true;
		this.gamesService
			.filterGames(page, filter)
			.pipe(
				takeUntil(this.destroy$),
				finalize(() => {
					this.isLoading = false;
				})
			)
			.subscribe(games => {
				this.totalGames = games.count;
				this.games = games.results;
				this.isLoading = false;
				this.cdr.detectChanges();
			});
	}
}
