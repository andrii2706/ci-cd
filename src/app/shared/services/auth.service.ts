import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, noop, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import User = firebase.User;
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Game } from '../models/games.interface';
import {
	Auth,
	onAuthStateChanged,
	sendPasswordResetEmail,
	updateProfile,
} from '@angular/fire/auth';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from './spinner.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	userLoggingWithFireBase = new BehaviorSubject<User | null>(null);
	private userLoggingWithFireBase$: Observable<User | null> =
		this.userLoggingWithFireBase.asObservable();
	userPasswordWithFireBase = new BehaviorSubject<string>('');
	private userPasswordWithFireBase$: Observable<string> =
		this.userPasswordWithFireBase.asObservable();
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	private userSubject = new BehaviorSubject<any>(null);
	public user$ = this.userSubject.asObservable();
	userLoginStatus = new BehaviorSubject<boolean>(false);
	userLoginStatus$: Observable<boolean> = this.userLoginStatus.asObservable();

	private loggedInStatus: boolean;

	constructor(
		private afAuth: AngularFireAuth,
		private snackbarComponent: MatSnackBar,
		private spinnerStatus: SpinnerService,
		private fireStore: Firestore,
		private auth: Auth,
		private router: Router
	) {
		this.initAuthListener();
	}

	setLoginStatus(value: boolean) {
		this.loggedInStatus = value;
		localStorage.setItem('loggedIn', 'false');
	}
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	changeLoginStatus(status: boolean, userInfo: User | null) {
		this.loggedInStatus = status;
		localStorage.setItem('loggedIn', `${this.loggedInStatus}`);
		if (userInfo) {
			this.getGameById(userInfo.uid).then(() => {
				localStorage.setItem(
					'user',
					JSON.stringify({ ...userInfo, games: [] })
				);
			});
		} else {
			localStorage.removeItem('user');
		}
	}

	get LoginStatus(): boolean {
		return JSON.parse(
			localStorage.getItem('loggedIn') || this.loggedInStatus.toString()
		);
	}
	proceedUserLoginStatus(status: boolean) {
		return this.userLoginStatus.next(status);
	}

	private initAuthListener() {
		onAuthStateChanged(this.auth, user => {
			this.userSubject.next(user);
		});
	}

	async googleLogin() {
		this.afAuth
			.signInWithPopup(new GoogleAuthProvider())
			.then(userInfo => {
				this.changeLoginStatus(true, userInfo.user);
				this.proceedUserLoginStatus(true);
				this.userLoggingWithFireBase.next(userInfo.user);
				this.router.navigate(['/home']);
			})
			.catch(error => {
				this.snackbarComponent.openFromComponent(SnackbarComponent, {
					duration: 5000,
					data: { text: error.message, status: 'error' },
					verticalPosition: 'top',
					horizontalPosition: 'center',
				});
			});
	}

	loginWithCredentials(email: string, password: string) {
		this.spinnerStatus.proceedSpinnerStatus(true);
		return this.afAuth
			.signInWithEmailAndPassword(email, password)
			.then(userInfo => {
				this.changeLoginStatus(true, userInfo.user);
				this.userLoggingWithFireBase.next(userInfo.user);
				this.userPasswordWithFireBase.next(password);
				this.proceedUserLoginStatus(true);
				this.router.navigate(['/home']);
			})
			.catch(error => {
				if (error.message.includes('auth/invalid-credential')) {
					this.snackbarComponent.openFromComponent(SnackbarComponent, {
						duration: 5000,
						data: {
							text: `You have a problem with login please check your credentials. Or Register into app `,
							status: 'error',
						},
						verticalPosition: 'top',
						horizontalPosition: 'center',
					});
					console.log('hello');
					this.spinnerStatus.proceedSpinnerStatus(false);
				}
			});
	}

	async signInWithCredentials(email: string, password: string) {
		return this.afAuth
			.createUserWithEmailAndPassword(email, password)
			.then(userInfo => {
				this.changeLoginStatus(true, userInfo.user);
				this.userLoggingWithFireBase.next(userInfo.user);
				this.proceedUserLoginStatus(true);
				this.router.navigate(['/home']);
				if (userInfo.user) {
					this.addGamesToUser(userInfo.user.uid, []).then();
					this.userAvatarUrl(userInfo.user.uid, '').then();
				}
			})
			.catch(() => {
				this.snackbarComponent.openFromComponent(SnackbarComponent, {
					duration: 5000,
					data: { text: 'You are not logged yet', status: 'error' },
					verticalPosition: 'top',
					horizontalPosition: 'center',
				});
			});
	}

	async updateUserInfo(displayName: string, email: string, photoUrl: string) {
		const auth = this.auth.currentUser;
		if (auth) {
			updateProfile(auth, {
				displayName,
			})
				.then(() => {
					noop();
				})
				/* eslint-disable  @typescript-eslint/no-unused-vars */
				.catch(error => {
					this.snackbarComponent.openFromComponent(SnackbarComponent, {
						duration: 5000,
						data: { text: 'Error updating user info', status: 'error' },
						verticalPosition: 'top',
						horizontalPosition: 'center',
					});
				});
			this.userAvatarUrl(auth.uid, photoUrl).then(() => {
				noop();
			});
		}
	}

	async logout() {
		return this.afAuth
			.signOut()
			.then(() => {
				this.router.navigate(['/']);
				this.proceedUserLoginStatus(false);
				this.changeLoginStatus(false, null);
			})
			.catch(() => {
				this.snackbarComponent.openFromComponent(SnackbarComponent, {
					duration: 5000,
					data: { text: 'Server is not responding ', status: 'error' },
					verticalPosition: 'top',
					horizontalPosition: 'center',
				});
			});
	}

	async addGamesToUser(userId: string, games: Game[]) {
		const gameRef = doc(this.fireStore, 'userGame', userId);
		try {
			await setDoc(gameRef, { games });
			this.snackbarComponent.openFromComponent(SnackbarComponent, {
				duration: 5000,
				data: { text: 'Game is added to user', status: 'success' },
				verticalPosition: 'top',
				horizontalPosition: 'center',
			});
			/* eslint-disable  @typescript-eslint/no-unused-vars */
		} catch (error) {
			this.snackbarComponent.openFromComponent(SnackbarComponent, {
				duration: 5000,
				data: { text: 'Game is not added to user', status: 'error' },
				verticalPosition: 'top',
				horizontalPosition: 'center',
			});
		}
	}

	async userAvatarUrl(userId: string, photoUrl: string) {
		const photoURL = doc(this.fireStore, 'userAvatarUrl', userId);
		try {
			await setDoc(photoURL, { photoUrl });
			this.snackbarComponent.openFromComponent(SnackbarComponent, {
				duration: 5000,
				data: { text: 'Avatar is added to user', status: 'error' },
				verticalPosition: 'top',
				horizontalPosition: 'center',
			});
			/* eslint-disable  @typescript-eslint/no-unused-vars */
		} catch (error) {
			this.snackbarComponent.openFromComponent(SnackbarComponent, {
				duration: 5000,
				data: { text: 'Avatar is not added to user', status: 'error' },
				verticalPosition: 'top',
				horizontalPosition: 'center',
			});
		}
	}

	async getAvatarById(id: string): Promise<any | undefined> {
		const avatarDoc = doc(this.fireStore, 'userAvatarUrl', id);
		const avatarDocSnapshot = await getDoc(avatarDoc);
		if (avatarDocSnapshot.exists()) {
			return { id: +avatarDocSnapshot.id, ...avatarDocSnapshot.data() };
		} else {
			return null;
		}
	}

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	async getGameById(id: string): Promise<any | undefined> {
		const gameDoc = doc(this.fireStore, 'userGame', id);
		const gameSnapshot = await getDoc(gameDoc);
		if (gameSnapshot.exists()) {
			return { id: +gameSnapshot.id, ...gameSnapshot.data() };
		} else {
			return null;
		}
	}

	async forgotPassword(email: string): Promise<void> {
		try {
			await sendPasswordResetEmail(this.auth, email);
			/* eslint-disable  @typescript-eslint/no-unused-vars */
		} catch (error) {
			this.snackbarComponent.openFromComponent(SnackbarComponent, {
				duration: 5000,
				data: { text: 'Password is not updated', status: 'error' },
				verticalPosition: 'top',
				horizontalPosition: 'center',
			});
		}
	}
}
