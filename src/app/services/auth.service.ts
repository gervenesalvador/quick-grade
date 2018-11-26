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
    console.log("asdfadf");
    // this.user = _firebaseAuth.authState;
    // this.user.subscribe((user) => {
    //   if (user) {
    //     this.userDetails = user;
    //     console.log(this.userDetails);
    //   } else {
    //     this.userDetails = null;
    //   }
    // });
  }

  // signInRegular(email, password) {
    // const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    // return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  // }

  // isLoggedIn() {
    // let user = localStorage.getItem('qg_user');
    // console.log(user);
    // if (user === null ||  typeof user === 'undefined') {
    //   return false;
    // }
    // return true;
  // }

  getUser() {
    // return this.userDetails;
  }

  logout() {
    // localStorage.clear();
    // this._firebaseAuth.auth.signOut().then((res) => this.router.navigate(['/']));
  }
}
