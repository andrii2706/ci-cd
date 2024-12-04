import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesComponent } from './games.component';
import { GamesService } from '../../shared/services/games.service';
import { noop, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Game } from '../../shared/models/games.interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';

describe('GamesComponent', () => {
	let component: GamesComponent;
	let fixture: ComponentFixture<GamesComponent>;
	/* eslint-disable  @typescript-eslint/no-unused-vars */
	let service: GamesService;
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	let mockGamesService: any;

	const mockGame = { id: 1, name: 'Test Game' };
	const mockGamesResponse = { count: 10, results: [mockGame] };
	const mockActivatedRoute = {
		snapshot: {
			data: {
				games: mockGamesResponse,
			},
		},
	};

	beforeEach(async () => {
		mockGamesService = {
			gamesData: of(mockGamesResponse),
			getAllGames: jest.fn().mockReturnValue(of(mockGamesResponse)),
			addGamesToUser: jest.fn().mockResolvedValue(of(void 0)),
			filterGames: jest.fn().mockReturnValue(of(mockGamesResponse)),
			getGameById: jest.fn().mockReturnValue(Promise.resolve(mockGame)),
			updateUserData: jest.fn().mockReturnValue(of(mockGamesResponse)),
		};

		await TestBed.configureTestingModule({
			declarations: [GamesComponent],
			imports: [NgxPaginationModule],
			providers: [
				{ provide: GamesService, useValue: mockGamesService },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
			],
			schemas: [NO_ERRORS_SCHEMA], // To ignore child components for this test
		}).compileComponents();

		fixture = TestBed.createComponent(GamesComponent);
		/* eslint-disable  @typescript-eslint/no-unused-vars */
		service = TestBed.inject(GamesService);
		component = fixture.componentInstance;
		fixture.detectChanges(); // Trigger ngOnInit
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load games on init', () => {
		expect(component.games).toEqual(mockGamesResponse.results);
		expect(component.total).toEqual(mockGamesResponse.count);
		expect(component.isLoading).toBe(false);
	});

	it('should get games on page change', () => {
		component.getGames(2);
		expect(mockGamesService.getAllGames).toHaveBeenCalledWith(2);
	});

	it('should add a game to boughtGames and update user data in localStorage and service', async () => {
		const mockUser = {
			multiFactor: { user: { uid: 'user123' } },
			games: [],
		};
		const mockGame = { id: 1, name: 'Test Game' };

		// Mock localStorage
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
				setItem: jest.fn(),
			},
			writable: true,
		});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const updateUserDataSpy = jest.spyOn(mockGamesService, 'updateUserData').mockResolvedValue();
		const cdrSpy = jest
			.spyOn(component['cdr'], 'detectChanges')
			.mockImplementation();

		await component.buyGame(mockGame as Game);

		expect(component.boughtGames).toContain(mockGame);
		expect(updateUserDataSpy).toHaveBeenCalledWith('user123', {
			games: [mockGame],
		});
		expect(localStorage.setItem).toHaveBeenCalledWith(
			'user',
			JSON.stringify({ ...mockUser, games: [mockGame] })
		);
		expect(cdrSpy).toHaveBeenCalled();
	});

	it('should update isGameBoughtStatus based on user games', async () => {
		const mockUser = {
			multiFactor: { user: { uid: 'user123' } },
		};
		const mockGames = { games: [{ id: 1, name: 'Test Game' }] };

		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
			},
			writable: true,
		});

		jest.spyOn(mockGamesService, 'getGameById').mockResolvedValue(mockGames);

		await component.isGameBought();

		expect(component.isGameBoughtStatus).toEqual(mockGames.games);
	});

	it('should navigate to a specific page and fetch games', () => {
		const getGamesSpy = jest.spyOn(component, 'getGames').mockImplementation();
		const filteredGamesSpy = jest
			.spyOn(component, 'filteredGames')
			.mockImplementation();
		component.filterParams = null;

		component.navigateTo(2);

		expect(component.page).toBe(2);
		expect(getGamesSpy).toHaveBeenCalledWith(2);

		component.filterParams = {
			search: 'test',
			genres: '',
			platforms: '',
			dates: '',
			developers: '',
			metacritic: '',
			ordering: '',
		};

		component.navigateTo(3);

		expect(component.page).toBe(3);
		expect(filteredGamesSpy).toHaveBeenCalledWith(3, component.filterParams);
	});

	it('should call getGames if no filters are applied', () => {
		const getGamesSpy = jest
			.spyOn(component, 'getGames')
			.mockImplementation(() => {
				noop();
			});

		component.filterParams = {
			search: '',
			genres: '',
			platforms: '',
			developers: '',
			ordering: '',
			dates: '',
			metacritic: '',
		};

		component.getFilterQuery(component.filterParams);

		expect(getGamesSpy).toHaveBeenCalledWith(1);
	});

	it('should fetch filtered games and update component state', () => {
		const mockResponse = {
			count: 10,
			results: [
				{ id: 1, name: 'Game 1' },
				{ id: 2, name: 'Game 2' },
			],
		};

		mockGamesService.filterGames.mockReturnValue(of(mockResponse)); // Повертаємо Observable

		component.filteredGames(1, {
			search: 'test',
			platforms: '',
			ordering: '',
			metacritic: '',
			developers: '',
			dates: '',
			genres: '',
		});

		expect(mockGamesService.filterGames).toHaveBeenCalledWith(1, {
			search: 'test',
			platforms: '',
			ordering: '',
			metacritic: '',
			developers: '',
			dates: '',
			genres: '',
		});
		expect(component.totalGames).toEqual(mockResponse.count);
		expect(component.games).toEqual(mockResponse.results);
		expect(component.isLoading).toBe(false);
	});
});
