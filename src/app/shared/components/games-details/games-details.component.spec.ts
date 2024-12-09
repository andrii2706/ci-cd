import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesDetailsComponent } from './games-details.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../../environment/environment';
import { Firestore } from '@angular/fire/firestore';
import { GamesService } from '../../services/games.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GamesDetailsComponent', () => {
	let component: GamesDetailsComponent;
	let fixture: ComponentFixture<GamesDetailsComponent>;
	let firestore: jest.Mocked<AngularFirestore>;
	let gamesServiceMock: GamesService;

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
			imports: [
				GamesDetailsComponent,
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase with your environment config
			],
			providers: [
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				{ provide: Firestore, useValue: firestore },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(GamesDetailsComponent);
		component = fixture.componentInstance;
		gamesServiceMock = TestBed.inject(GamesService);
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

	it('should call gameDetailsById with correct id when route param changes', () => {
		const gameDetailsByIdSpy = jest.spyOn(component, 'gameDetailsById');
		component.activatedRoute.params.subscribe(() => {
			expect(gameDetailsByIdSpy).toHaveBeenCalledWith('123');
		});
	});

	it('should call history.back() when backButton is called', () => {
		const backSpy = jest.spyOn(window.history, 'back');
		component.backButton();
		expect(backSpy).toHaveBeenCalled();
	});
	it('should handle game details successfully and assign values to gameDetails and gameTrailers', () => {
		const mockGameDetails = { id: '123', name: 'Test Game' };
		const mockGameTrailers = { id: '123', trailer: 'trailer_url' };

		component.gameDetailsById('123');

		gamesServiceMock.getGameByIdFromBE('123').subscribe(() => {
			expect(component.gameDetails).toBe(mockGameDetails);
		});
		gamesServiceMock.getGameMovieById('123').subscribe(() => {
			expect(component.gameTrailers).toBe(mockGameTrailers);
		});
	});
});
