import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // usersCollection: AngularFirestoreCollection<User>;
  // users: Observable<User[]>;

  // constructor(private afs: AngularFirestore) { }

  // getUsers(): User[] {
  //   this.usersCollection = this.afs.collection<User>('Users');
  //   this.users = this.usersCollection.valueChanges();
  //   return this.users;
  // }
}
