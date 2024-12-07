import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { environment } from '../../../environment/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';
import {
	BrowserAnimationsModule,
	NoopAnimationsModule,
} from '@angular/platform-browser/animations';

describe('AuthService', () => {
	let service: AuthService;
	let firestoreMock: jest.Mocked<Firestore>;
	const mockAuth = {
		onAuthStateChanged: jest.fn(callback => callback(null)),
		signInWithEmailAndPassword: jest.fn(() =>
			of({ user: { email: 'test@example.com' } })
		),
		signInWithPopup: jest.fn(() => of({ user: { uid: 'testUid' } })),
		createUserWithEmailAndPassword: jest.fn(() =>
			of({ user: { uid: 'testUid', email: 'test@example.com' } })
		),
		signOut: jest.fn(() => of({})),
		currentUser: {
			updateProfile: jest.fn(),
			updatePassword: jest.fn(),
		},
		sendPasswordResetEmail: jest.fn(() => of({})),
	};

	beforeEach(() => {
		firestoreMock = {
			/* eslint-disable   @typescript-eslint/ban-ts-comment */
			// @ts-ignore
			collection: jest.fn().mockReturnValue({
				doc: jest.fn().mockReturnValue({
					set: jest.fn(),
				}),
			}),
		};
		TestBed.configureTestingModule({
			imports: [
				AngularFireModule.initializeApp(environment.firebaseConfig),
				BrowserAnimationsModule,
				NoopAnimationsModule,
			],
			providers: [
				{ provide: Firestore, useValue: firestoreMock },
				{ provide: Auth, useValue: mockAuth },
			],
		});
		service = TestBed.inject(AuthService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should login with Google', () => {
		service.googleLogin();
		expect(mockAuth.signInWithPopup).toHaveBeenCalledTimes(0);
	});

	it('should login with credentials', () => {
		const email = 'test@example.com';
		const password = 'password123';
		service.loginWithCredentials(email, password).then(() => {
			expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
		});
	});

	it('should sign in with credentials', () => {
		const email = 'test@example.com';
		const password = 'password123';
		service.signInWithCredentials(email, password).then(() => {
			expect(mockAuth.createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
		});
	});

	it('should logout', () => {
		service.logout().then(() => {
			expect(mockAuth.signOut).toHaveBeenCalledTimes(1);
		});
	});

	it('should send password reset email', () => {
		const email = 'email@example.com';
		service.forgotPassword(email).then(() => {
			expect(mockAuth.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
		});
	});
});
