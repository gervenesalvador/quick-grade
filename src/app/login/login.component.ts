import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ModalDirective } from 'angular-bootstrap-md';

import { User } from '../models/user.model';

import { AuthService } from '../services/auth.service';

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
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    photo: new FormControl(''),
  });

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  // photoUrl: any;
  photo: any;
  
  constructor(
    private authService: AuthService,
  	private afs: AngularFirestore,
  	private router: Router,
    private _firebaseAuth: AngularFireAuth,
    private storage: AngularFireStorage
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
        // console.log(res);
        // console.log(res.user.getIdToken());
        this.setAuth(res.user.uid, res.user.displayName, res.user.email, res.user.photoURL);

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

        this.setAuth(res.user.uid, res.user.displayName, res.user.email, res.user.photoURL);
        // localStorage.setItem('qg_user', JSON.stringify({id: res.user.uid, email: res.user.email }));
        this.router.navigate(['/classes']);
      }).catch((err) => {
        console.log("Something went wrong: " + err);
      });
  }

  createAccountRegular() {
    let data = this.userCreateForm.value;
    this.authService.createAccountRegular(data.email, data.password)
      .then((res) => {
        this.afs.collection('Users').doc(res.user.uid).set({email: res.user.email}); // create or update current user
        // localStorage.setItem('qg_user', JSON.stringify({id: res.user.uid, email: res.user.email }));

        // save photo first
        
        let ext = this.photo.type.split('/')[1],
            photo_filePath = `profile/${new Date().getTime()}.${ext}`, 
            ref = this.storage.ref(photo_filePath),
            task = this.storage.upload(photo_filePath, this.photo);

        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(
              (photo_url) => {
                this.authService.updateUser({
                  name: data.name,
                  photoURL: photo_url,
                });
                this.setAuth(res.user.uid, data.name, res.user.email, photo_url);

                this.router.navigate(['/classes']);
                return true;
              }
            );
          })
        ).subscribe();
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

  uploadFile(event) {
    this.photo = event.target.files[0];
    // console.log(this.photo);
    // let file = event.target.files[0],
    //     ext = file.type.split('/')[1],
    //     filePath = `profile/${new Date().getTime()}.${ext}`,
    //     fileRef = this.storage.ref(filePath),
    //     task = this.storage.upload(filePath, file);

    // observe percentage changes
    // this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    // task.snapshotChanges().pipe(
    //     finalize(() => {
    //       this.downloadURL = fileRef.getDownloadURL();
    //       console.log(this.downloadURL);
    //     })
    // ).subscribe(
    //   (res: any) => {
    //     console.log(res);
    //     console.log(this.downloadURL);
    //   }
    // );

  }

  setAuth(id, name, email, photo) {
    localStorage.setItem('qg_user', JSON.stringify({
      id: id, 
      name: name,
      email: email,
      picture: photo,
    }));
  }

}
