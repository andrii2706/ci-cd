import { TestBed } from '@angular/core/testing';
import { GamesService } from './games.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore } from '@angular/fire/firestore';
import { environment } from '../../../environment/environment';


describe('GamesService', () => {
  let service: GamesService;
  let httpMock: HttpTestingController;
  let snackBarMock: jest.Mocked<MatSnackBar>;
  let firestoreMock: jest.Mocked<Firestore>;

  beforeEach(() => {
    /* eslint-disable   @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    snackBarMock = {
      openFromComponent: jest.fn(),
    };

    firestoreMock = {
      /* eslint-disable   @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      collection: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GamesService,
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Firestore, useValue: firestoreMock },
      ],
    });

    service = TestBed.inject(GamesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLastReleasedGames', () => {
    it('should return games data', () => {
      const mockGames = { count: 2, results: [] }; // Example mock data
      const page = 1;
      const dates = '2023-01-01,2023-12-31';

      service.getLastReleasedGames(page, dates).subscribe((data) => {
        expect(data).toEqual(mockGames);
      });

      const req = httpMock.expectOne(
        `${environment.rawgApaUrl}/games?key=${environment.rawgApiKey}&page=${page}&dates=${dates}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockGames);
    });
  });

  describe('getAllGames', () => {
    it('should return all games data', () => {
      const mockGames = { count: 5, results: [] }; // Example mock data
      const page = 2;

      service.getAllGames(page).subscribe((data) => {
        expect(data).toEqual(mockGames);
      });

      const req = httpMock.expectOne(
        `${environment.rawgApaUrl}/games?key=${environment.rawgApiKey}&page=${page}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockGames);
    });
  });

  describe('filterGames', () => {
    it('should return filtered games data', () => {
      const mockGames = { count: 3, results: [] };
      const page = 1;
      const filterParams = { genre: 'action', platforms: 'PC', ordering:'',metacritic:'', developers:'', dates:'', search:'' };
      service.filterGames(page, filterParams).subscribe((data) => {
        expect(data).toEqual(mockGames);
      });

      const req = httpMock.expectOne(
        `${environment.rawgApaUrl}/games?key=${environment.rawgApiKey}&page=${page}&genre=action&platforms=PC`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockGames);
    });
  });

  describe('getGameByIdFromBE', () => {
    it('should return game details', () => {
      const mockGameDetails = { id: '123', name: 'Test Game' }; // Example mock data
      const gameId = '123';

      service.getGameByIdFromBE(gameId).subscribe((data) => {
        expect(data).toEqual(mockGameDetails);
      });

      const req = httpMock.expectOne(
        `${environment.rawgApaUrl}/games/123?key=${environment.rawgApiKey}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockGameDetails);
    });
  });

  describe('getGameMovieById', () => {
    it('should return game trailers', () => {
      const mockGameTrailers = { count: 2, results: [] }; // Example mock data
      const gameId = '123';

      service.getGameMovieById(gameId).subscribe((data) => {
        expect(data).toEqual(mockGameTrailers);
      });

      const req = httpMock.expectOne(
        `${environment.rawgApaUrl}/games/123/movies?key=${environment.rawgApiKey}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockGameTrailers);
    });
  });
});
