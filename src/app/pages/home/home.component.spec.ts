import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { GamesComponent } from '../games/games.component';
import { Firestore } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';


xdescribe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
  // let service: GamesService;
  let firestore: jest.Mocked<AngularFirestore>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HomeComponent,  HttpClientModule,
              MatSnackBarModule,
              RouterTestingModule.withRoutes([
                { path: 'games', component: GamesComponent },
              ])],
      providers:[
        { provide: Firestore, useValue: firestore },
      ]
		}).compileComponents();

		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
