import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import firebase from "firebase/compat/app";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Router} from "@angular/router";
import User = firebase.User;

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
    private afs: AngularFirestore
  ) {}
  setLoginStatus(value: boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'false');
  }

  changeLoginStatus(status: boolean, userInfo: any) {
    this.loggedInStatus = status;
    localStorage.setItem('loggedIn', `${this.loggedInStatus}`);
    localStorage.setItem('user', JSON.stringify({ ...userInfo, games: [] }));
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
        console.log(this.loggedInStatus)
      }
    )
  }

  loginWithCredentials(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(
      userInfo => {
        this.changeLoginStatus(true, userInfo.user)
        this.userLoggingWithFireBase.next(userInfo.user);
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
      }
    );
  }
}
