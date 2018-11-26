import { Component, OnInit } from '@angular/core';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable } from 'rxjs/Observable';
// import { map } from 'rxjs/operators';

// interface User {
//   name: string;
// }
// quickgradesample@gmail.com
// quickgrade2018

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
	// usersCollection: AngularFirestoreCollection<User>;
  //  users: Observable<User[]>;
  constructor() { }
  // constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    // this.usersCollection = this.afs.collection('Users');
    // this.users = this.usersCollection.valueChanges();
  }

}
