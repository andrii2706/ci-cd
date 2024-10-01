import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {BehaviorSubject, Observable} from "rxjs";
import firebase from "firebase/compat/app";
import {Router} from "@angular/router";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import User = firebase.User;
import {doc, Firestore, setDoc} from "@angular/fire/firestore";
import {Game} from "../models/games.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggingWithFireBase = new BehaviorSubject<User | null>(null);
  private userLoggingWithFireBase$: Observable<User | null> = this.userLoggingWithFireBase.asObservable();

  private loggedInStatus: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private fireStore: Firestore
  ) {
  }

  setLoginStatus(value: boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'false');
  }
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  changeLoginStatus(status: boolean, userInfo: any) {
    this.loggedInStatus = status;
    localStorage.setItem('loggedIn', `${this.loggedInStatus}`);
    localStorage.setItem('user', JSON.stringify({...userInfo, games: []}));
  }

  get LoginStatus(): boolean {
    return JSON.parse(
      localStorage.getItem('loggedIn') || this.loggedInStatus.toString()
    );
  }

  googleLogin() {
    this.afAuth.signInWithPopup(new GoogleAuthProvider()).then(
      userInfo => {
        this.changeLoginStatus(true, userInfo.user)
        this.userLoggingWithFireBase.next(userInfo.user)
        if(userInfo.user){
          this.addGamesToUser(userInfo.user.uid, []).then()
        }
      }
    )
  }

  loginWithCredentials(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(
      userInfo => {
        this.changeLoginStatus(true, userInfo.user)
        this.userLoggingWithFireBase.next(userInfo.user);
        if(userInfo.user){
          this.addGamesToUser(userInfo.user.uid, []).then()
        }
        this.router.navigate(['/home']);
      }
    ).catch(err => {
      console.error('Помилка під час входу:', err);
    });
  }


  signInWithCredentials(email: string, password: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password).then(
      userInfo => {
        this.changeLoginStatus(true, userInfo.user)
        this.userLoggingWithFireBase.next(userInfo.user);
        if(userInfo.user){
          this.addGamesToUser(userInfo.user.uid, []).then()
        }
      }
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.afAuth.authState;
  }


  async getCurrentUserPromise(): Promise<User | null> {
    return this.afAuth.currentUser;
  }

  async addGamesToUser(userId: string, games: Game[]) {
    const gameRef = doc(this.fireStore, 'userGame', userId);
    try {
      await setDoc(gameRef, {games });
    } catch (error) {
      console.error('Помилка створення документа: ', error);
    }
  }

}
