import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesDetailsComponent } from './games-details.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../../environment/environment';
import { Firestore } from '@angular/fire/firestore';
import { GamesService } from '../../services/games.service';


describe('GamesDetailsComponent', () => {
	let component: GamesDetailsComponent;
	let fixture: ComponentFixture<GamesDetailsComponent>;
  let firestore: jest.Mocked<AngularFirestore>;
  let gamesServiceMock: jest.Mocked<GamesService>;

  // const mockGame = { id: 1234567, name: 'Test Game' }
  // const mockGameTrailers = { count: 10, results: [
  //     {
  //       id: 1234567,
  //       name: 'hello-world',
  //       preview: 'hello-world.jpg',
  //       data: {
  //         480: '480px',
  //         max: '1024px',
  //       }
  //     },
  //     {
  //       id: 1234568,
  //       name: 'hello-world-2',
  //       preview: 'hello-world.jpg',
  //       data: {
  //         480: '480px',
  //         max: '1024px',
  //       }
  //     },
  //     {
  //       id: 1234569,
  //       name: 'hello-world-3',
  //       preview: 'hello-world.jpg',
  //       data: {
  //         480: '480px',
  //         max: '1024px',
  //       }
  //     },
  //   ] }

  // const mockGamesService = {
  //   getGameByIdFromBE: jest.fn(),
  //   getGameMovieById: jest.fn()
  // }

  const mockActivatedRoute = {
    params: of({ id: '123' }),
  };

  beforeEach(async () => {
    firestore = {
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          valueChanges: jest.fn(),
        }),
      }),
    } as unknown as jest.Mocked<AngularFirestore>;
		await TestBed.configureTestingModule({
			imports: [GamesDetailsComponent, HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase with your environment config
        ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Firestore, useValue: firestore },
        { provide: GamesService, useValue: gamesServiceMock }
      ],
		}).compileComponents();

		fixture = TestBed.createComponent(GamesDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

  it('should navigate back in history', () => {
    const historySpy = jest.spyOn(history, 'back');

    component.backButton();

    expect(historySpy).toHaveBeenCalled();
  });
});
