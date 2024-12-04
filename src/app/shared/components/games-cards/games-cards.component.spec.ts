import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesCardsComponent } from './games-cards.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../models/games.interface';
import { AppMaterialModule } from '../../../app-material/app-material.module';
import { ReplaceNullImgPipe } from '../../pipe/replace-null-img.pipe';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GamesCardsComponent', () => {
	let component: GamesCardsComponent;
	let fixture: ComponentFixture<GamesCardsComponent>;
	let snackBarMock: jest.Mocked<MatSnackBar>;
	let routerMock: { navigate: jest.Mock };
	let activatedRouteMock: Partial<ActivatedRoute>;

	beforeEach(() => {
		/* eslint-disable   @typescript-eslint/ban-ts-comment */
		//@ts-ignore
		snackBarMock = {
			openFromComponent: jest.fn(),
		};

		routerMock = {
			navigate: jest.fn(),
		};

		activatedRouteMock = {};

		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				BrowserAnimationsModule,
				AppMaterialModule,
				SpinnerComponent,
				ReplaceNullImgPipe,
				GamesCardsComponent,
			],
			providers: [
				{ provide: MatSnackBar, useValue: snackBarMock },
				{ provide: Router, useValue: routerMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(GamesCardsComponent);
		component = fixture.componentInstance;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('ngOnInit', () => {
		it('should initialize userStatus correctly', () => {
			const userMock = '{"userId": "123"}';
			localStorage.setItem('user', userMock);

			component.ngOnInit();

			expect(component.userStatus).toBe(false); // userStatus should be true if user is present
		});

		it('should set userStatus to false if no user in localStorage', () => {
			localStorage.removeItem('user');
			component.ngOnInit();
			expect(component.userStatus).toBe(false);
		});
	});

	describe('game setter', () => {
		it('should set gameInfo correctly when game is passed in', () => {
			const game: Game = { id: 1, name: 'Test Game', released: '2024-01-01' };
			component.game = game;

			expect(component.gameInfo).toEqual(game);
		});
	});

	describe('isGameBought setter', () => {
		it('should set showLabel to true if game is already bought', () => {
			const game: Game = { id: 1, name: 'Test Game', released: '2024-01-01' };
			const boughtGames: Game[] = [
				{ id: 1, name: 'Test Game', released: '2024-01-01' },
			];
			component.game = game;
			component.isGameBought = boughtGames;

			expect(component.showLabel).toBe(true);
		});

		it('should not change showLabel if game is not bought', () => {
			const game: Game = { id: 1, name: 'Test Game', released: '2024-01-01' };
			const boughtGames: Game[] = [
				{ id: 2, name: 'Another Game', released: '2024-01-01' },
			];
			component.game = game;
			component.isGameBought = boughtGames;

			expect(component.showLabel).toBeUndefined();
		});
	});

	describe('goToGameDetails', () => {
		it('should navigate to the game details page when in /home route', () => {
			component.gameInfo = { id: 1, name: 'Test Game', released: '2024-01-01' };
			routerMock.navigate.mockResolvedValue(true);
			/* eslint-disable   @typescript-eslint/ban-ts-comment */
			//@ts-ignore
			component.router.url = '/home';

			component.goToGameDetails();

			expect(routerMock.navigate).toHaveBeenCalledWith(['/games/1'], {
				relativeTo: activatedRouteMock,
			});
		});

		it('should navigate to the game details page when not in /home route', () => {
			component.gameInfo = { id: 1, name: 'Test Game', released: '2024-01-01' };
			routerMock.navigate.mockResolvedValue(true);
			/* eslint-disable   @typescript-eslint/ban-ts-comment */
			//@ts-ignore
			component.router.url = '/other';

			component.goToGameDetails();

			expect(routerMock.navigate).toHaveBeenCalledWith([1], {
				relativeTo: activatedRouteMock,
			});
		});
	});
});
