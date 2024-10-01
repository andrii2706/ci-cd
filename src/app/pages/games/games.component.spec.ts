import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesComponent } from './games.component';
import { GamesService } from '../../shared/services/games.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Game } from "../../shared/models/games.interface";
import {NgxPaginationModule } from "ngx-pagination";

xdescribe('GamesComponent', () => {
  let component: GamesComponent;
  let fixture: ComponentFixture<GamesComponent>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */

  let mockGamesService: any;

  const mockGame = { id: 1, name: 'Test Game' };
  const mockGamesResponse = { count: 10, results: [mockGame] };

  beforeEach(async () => {
    mockGamesService = {
      gamesData: of(mockGamesResponse),
      getAllGames: jest.fn().mockReturnValue(of(mockGamesResponse)),
      addGamesToUser: jest.fn().mockResolvedValue(of(void 0)),
      filterGames: jest.fn().mockReturnValue(of(mockGamesResponse)),
    };

    await TestBed.configureTestingModule({
      declarations: [GamesComponent ],
      imports: [NgxPaginationModule],
      providers: [{ provide: GamesService, useValue: mockGamesService }],
      schemas: [NO_ERRORS_SCHEMA] // To ignore child components for this test
    }).compileComponents();

    fixture = TestBed.createComponent(GamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load games on init', () => {
    expect(component.games).toEqual(mockGamesResponse.results);
    expect(component.total).toEqual(mockGamesResponse.count);
    expect(component.isLoading).toBe(true);
  });

  it('should get games on page change', () => {
    component.getGames(2);
    expect(mockGamesService.getAllGames).toHaveBeenCalledWith(2);
  });

  it('should buy a game and update user info', () => {
    const user = { multiFactor: { user: { uid: 'user123' } }, games: [] };
    localStorage.setItem('user', JSON.stringify(user));

    component.boughtGames = [];
    component.buyGame(mockGame as Game);

    const updatedUser = JSON.parse(localStorage.getItem('user')!);
    expect(updatedUser.games).toContainEqual(mockGame);
    expect(component.boughtGames).toContain(mockGame);
    expect(mockGamesService.addGamesToUser).toHaveBeenCalledWith('user123', [mockGame]);
  });

  it('should filter games when filter query is set', () => {
    const filterParams = {
      search: 'test',
      genres: 'action',
      platforms: '',
      developers: '',
      ordering: '',
      dates: '',
      metacritic: ''
    };

    component.getFilterQuery(filterParams);
    expect(mockGamesService.filterGames).toHaveBeenCalledWith(1, filterParams);
  });

  it('should get unfiltered games if no filter is set', () => {
    const emptyFilterParams = {
      search: '',
      genres: '',
      platforms: '',
      developers: '',
      ordering: '',
      dates: '',
      metacritic: ''
    };

    component.getFilterQuery(emptyFilterParams);
    expect(mockGamesService.getAllGames).toHaveBeenCalledWith(1);
  });

  it('should navigate to a page and load filtered games', () => {
    const filterParams = { search: 'test', genres: '', platforms: '', developers: '', ordering: '', dates: '', metacritic: '' };
    component.filterParams = filterParams;
    component.navigateTo(2);

    expect(mockGamesService.filterGames).toHaveBeenCalledWith(2, filterParams);
  });
});
