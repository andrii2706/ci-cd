import { Injectable } from '@angular/core';
import firebase from "firebase/compat";
import Firestore = firebase.firestore.Firestore;
import { AngularFireAuth } from "@angular/fire/compat/auth"
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {BehaviorSubject, Observable} from "rxjs";
import {UserInterface} from "../models/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  constructor(
    private afAuth: AngularFireAuth,
    private fireStore: Firestore
  ) { }

  userLoggingWithFireBase = new BehaviorSubject<UserInterface | null>(null);
  private userLoggingWithFireBase$: Observable<UserInterface | null> =
    this.userLoggingWithFireBase.asObservable();

  googleLogin(){
    this.afAuth.signInWithPopup(new GoogleAuthProvider()).then(
      userInfo => {
        this.userLoggingWithFireBase.next(userInfo.user)
      }
    )
  }
  loginWithCredentials(email: string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email, password).then(
      userInfo => {
        this.userLoggingWithFireBase.next(userInfo.user)
      },
      err => {
        if (err) {
          console.error('Error');
        }
      }
    );
  }

  signInWithCredentials(email: string, password: string){
    this.afAuth.createUserWithEmailAndPassword(email, password).then(
      userInfo => {
          this.userLoggingWithFireBase.next(userInfo.user)
      })
  }
}
