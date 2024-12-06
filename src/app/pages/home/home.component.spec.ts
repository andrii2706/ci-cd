import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { GamesService } from '../../shared/services/games.service';
import { ErrorService } from '../../shared/services/error.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Game, Games } from '../../shared/models/games.interface';
import moment from 'moment';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let gamesServiceMock: jest.Mocked<GamesService>;
  let errorServiceMock: jest.Mocked<ErrorService>;
  let spinnerServiceMock: jest.Mocked<SpinnerService>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  let activatedRouteMock: any;
  let cdrMock: jest.Mocked<ChangeDetectorRef>;

  beforeEach(async () => {
    gamesServiceMock = {
      getLastReleasedGames: jest.fn(),
      getGameById: jest.fn(),
      updateUserData: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<GamesService>;

    errorServiceMock = {
      fullErrorObject: jest.fn(),
    } as unknown as jest.Mocked<ErrorService>;

    spinnerServiceMock = {
      proceedSpinnerStatus: jest.fn(),
    } as unknown as jest.Mocked<SpinnerService>;

    activatedRouteMock = {
      snapshot: {
        data: {
          games: {
            results: [
              { id: 1, name: 'Game 1' },
              { id: 2, name: 'Game 2' },
            ],
            count: 2,
          },
        },
      },
    };

    cdrMock = {
      detectChanges: jest.fn(),
    } as unknown as jest.Mocked<ChangeDetectorRef>;

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      declarations: [],
      providers: [
        { provide: GamesService, useValue: gamesServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize games and total on ngOnInit', () => {
    component.ngOnInit();

    expect(component.games).toEqual([
      { id: 1, name: 'Game 1' },
      { id: 2, name: 'Game 2' },
    ]);
    expect(component.total).toBe(2);
    expect(spinnerServiceMock.proceedSpinnerStatus).toHaveBeenCalledWith(false);
  });

  it('should fetch new games on getNewGames', () => {
    const mockGamesResponse: Games = {
      count: 1,
      next: null,
      previous: null,
      results: [{ id: 3, name: 'Game 3' }],
      seo_title: 'SEO Title Example',
      seo_h1: 'SEO H1 Example',
    };

    gamesServiceMock.getLastReleasedGames.mockReturnValue(of(mockGamesResponse));

    component.getNewGames(2);

    expect(gamesServiceMock.getLastReleasedGames).toHaveBeenCalledWith(
      2,
      `${moment().startOf('year').format('YYYY-MM-DD')},${moment()
        .add(1, 'year')
        .endOf('year')
        .format('YYYY-MM-DD')}`
    );
    expect(component.total).toBe(1);
    expect(component.games).toEqual([{ id: 3, name: 'Game 3' }]);
    expect(spinnerServiceMock.proceedSpinnerStatus).toHaveBeenCalledWith(true);
  });

  it('should update user data when buying a game', async () => {
    const mockGame = { id: 1, name: 'Game 1' } as Game;
    const mockUser = {
      multiFactor: { user: { uid: 'user123' } },
      games: [],
    };
    localStorage.setItem('user', JSON.stringify(mockUser));

    component.buyGame(mockGame);

    const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
    expect(updatedUser.games).toEqual([mockGame]);
    expect(gamesServiceMock.updateUserData).toHaveBeenCalledWith('user123', {
      games: [mockGame],
    });
  });
});
