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
	updatePassword,
	updateProfile,
} from '@angular/fire/auth';

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
	private userLoginStatus$: Observable<boolean> =
		this.userLoginStatus.asObservable();

	private loggedInStatus: boolean;

	constructor(
		private afAuth: AngularFireAuth,
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
	changeLoginStatus(status: boolean, userInfo: any) {
		this.loggedInStatus = status;
		localStorage.setItem('loggedIn', `${this.loggedInStatus}`);
		if (userInfo) {
			this.getGameById(userInfo.uid).then(() => {
				localStorage.setItem('user', JSON.stringify({ ...userInfo }));
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

	googleLogin() {
		this.afAuth.signInWithPopup(new GoogleAuthProvider()).then(userInfo => {
			this.changeLoginStatus(true, userInfo.user);
			this.proceedUserLoginStatus(true);
			this.userLoggingWithFireBase.next(userInfo.user);
			this.router.navigate(['/home']);
		});
	}

	loginWithCredentials(email: string, password: string) {
		return this.afAuth
			.signInWithEmailAndPassword(email, password)
			.then(userInfo => {
				this.changeLoginStatus(true, userInfo.user);
				this.userLoggingWithFireBase.next(userInfo.user);
				this.userPasswordWithFireBase.next(password);
				this.proceedUserLoginStatus(true);
				this.router.navigate(['/home']);
			})
			.catch(err => {
				console.error('Помилка під час входу:', err);
			});
	}

	signInWithCredentials(email: string, password: string) {
		this.afAuth
			.createUserWithEmailAndPassword(email, password)
			.then(userInfo => {
				this.changeLoginStatus(true, userInfo.user);
				this.userLoggingWithFireBase.next(userInfo.user);
				this.proceedUserLoginStatus(true);
				if (userInfo.user) {
					this.addGamesToUser(userInfo.user.uid, []).then();
					this.userAvatarUrl(userInfo.user.uid, '').then();
				}
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
				.catch(error => {
					console.error(error);
				});
			this.userAvatarUrl(auth.uid, photoUrl).then(() => {
				noop();
			});
			// updateEmail(auth, email).then(() => {
			//   console.log('email updated');
			// }).catch((error) => {
			//   console.log(error);
			// });
		}
	}

	async updateUserPassword(newPassword: string): Promise<void> {
		const user = this.auth.currentUser;
		if (user) {
			try {
				await updatePassword(user, newPassword);
			} catch (e) {
				console.error(e);
			}
		}
	}

	logout() {
		return this.afAuth
			.signOut()
			.then(() => {
				this.router.navigate(['/']);
				this.proceedUserLoginStatus(false);
				this.changeLoginStatus(false, null);
			})
			.catch(error => {
				console.error('Logout error:', error);
			});
	}

	async addGamesToUser(userId: string, games: Game[]) {
		const gameRef = doc(this.fireStore, 'userGame', userId);
		try {
			await setDoc(gameRef, { games });
		} catch (error) {
			console.error('Помилка створення документа: ', error);
		}
	}
	async userAvatarUrl(userId: string, photoUrl: string) {
		const photoURL = doc(this.fireStore, 'userAvatarUrl', userId);
		try {
			await setDoc(photoURL, { photoUrl });
		} catch (error) {
			console.error('Помилка створення документа: ', error);
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
		} catch (error) {
			console.error('Error callback', error);
		}
	}
}
