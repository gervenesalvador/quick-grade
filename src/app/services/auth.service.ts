import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {

    this.user = _firebaseAuth.authState;
    this.user.subscribe((user) => {
      if (user) {
        this.userDetails = user;
        console.log(this.userDetails);
      } else {
        this.userDetails = null;
      }
    });
  }

  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  createAccountRegular(email, password) {
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  isLoggedIn() {
    let user = JSON.parse(localStorage.getItem('qg_user'));
    if (user === null ||  typeof user === 'undefined') {
      return false;
    }
    return true;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('qg_user'));
  }

  updateUser(data) {
    this._firebaseAuth.auth.currentUser.updateProfile({
      displayName: data.name,
      photoURL: data.photoURL,
    })
  }

  logout() {
    localStorage.clear();
    this._firebaseAuth.auth.signOut().then((res) => this.router.navigate(['/']));
  }
}
