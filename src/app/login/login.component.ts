import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
import { AuthService } from '../services/auth.service';
// import { Observable } from 'rxjs/Observable';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private user: Observable<firebase.User>;

  googleUser: any;
	usersCollection: AngularFirestoreCollection<User>;
  @ViewChild('alert') alert: ElementRef;
  @ViewChild('create_user') create_user: ModalDirective;
  alert_message = "";
	userForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});
  userCreateForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
  	private afs: AngularFirestore,
  	private router: Router,
    private _firebaseAuth: AngularFireAuth,
    
  ) {
    // console.log(this._firebaseAuth.authState);
    this.user = _firebaseAuth.authState;
    // console.log(_firebaseAuth.authState);
  }

  ngOnInit() {
  	this.alert.nativeElement.classList.remove('show');
  	this.alert.nativeElement.style.display = 'none';
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/classes']);
    }
  }

  signInWithEmail() {
    let data = this.userForm.value;
    this.authService.signInRegular(data.email, data.password)
      .then((res) => {
        localStorage.setItem('qg_user', JSON.stringify({id: res.user.uid, email: res.user.email }));
        this.router.navigate(['/classes']);
      }).catch((err) =>
        this.showAlert("Error: " + err )
      );
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
      .then((res) => {
        // check if google account exist in users database
        // console.log(res);
        // this.googleUser = this.afs.collection('Users', ref => ref.where('email', '==', res.user.email)).valueChanges();
        // user.subscribe(data => {
        //   console.log(data);
        // });


        localStorage.setItem('qg_user', JSON.stringify({id: res.user.uid, email: res.user.email }));
        this.router.navigate(['/classes']);
      }).catch((err) => {
        console.log("Something went wrong: " + err);
      });
  }

  createAccountRegular() {
    let data = this.userCreateForm.value;
    this.authService.createAccountRegular(data.email, data.password)
      .then((res) => {
        this.afs.collection('Users').doc(res.user.uid).set({email: res.user.email});
        localStorage.setItem('qg_user', JSON.stringify({id: res.user.uid, email: res.user.email }));
        this.router.navigate(['/classes']);
      });
    this.closeCreateUserForm();
  }

  showCreateUserForm() {
    this.userCreateForm.reset();
    this.create_user.show();
  }

  closeCreateUserForm() {
    this.userCreateForm.reset();
    this.create_user.hide();
  }

  // logout() {
  //   this.authService.logout();
  //   console.log("logout");
  // }

  // login() :void {
  // 	let data = this.userForm.value;
  // 	this.usersCollection = this.afs.collection<User>('Users', ref => ref.where('email', '==', data.email));
		// this.usersCollection.snapshotChanges().map(user => {
		// 	return user.map(user_data => {
		// 		return { id: user_data.payload.doc.id, ...user_data.payload.doc.data() };
		// 	});
		// }).subscribe(user => {
  //     console.log(user[0].id);
		// 	if (user[0].id) {
  //       console.log("/users/"+user[0].id+"/classes")

  //       this.router.navigateByUrl("/users/"+user[0].id+"/classes");
  //       // this.router.navigate(["/users/"+user[0].id+"/classes"]);
		// 	} else {
		// 		this.userForm.reset();
		// 		this.showAlert("Email not found");
		// 	}
			
		// });
  // }

  closeAlert() {
  	this.alert_message = "";
    this.alert.nativeElement.classList.remove('show');
    this.alert.nativeElement.style.display = 'none';
  }

  showAlert(message) {
  	this.alert_message = message;
  	this.alert.nativeElement.classList.add('show');
    this.alert.nativeElement.style.display = 'block';
  }
}
