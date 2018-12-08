import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

import { Class } from '../models/class.model';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  classGetAll = new Subject<Class[]>();
  classGetOne = new Subject<Class>();
  userAuth: any;
  classCollection: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.userAuth = this.authService.getUser();
    this.classCollection = this.afs.collection('Users').doc(this.userAuth['id']).collection<Class>('Class');
  }

  getAll() {
    return this.classCollection.snapshotChanges()
    .map(
      (response: any) => {
        return response.map(
          (data: any) => {
            // console.log(data);
            let cl = data.payload.doc.data() as Class;
            return { id: data.payload.doc.id, ...cl };
          }
        );
      }
    ).subscribe(
      (response: any) => {
        this.classGetAll.next(response);
      },
      (response: any) => {
        this.classGetAll.next(response.error);
      }
    );
  }

  getOne(class_uid) {
    return this.classCollection.doc(class_uid).snapshotChanges()
    .map(
      (data: any) => {
        return { id: data.payload.id, ...data.payload.data() };
      }
    ).subscribe(
      (response: any) => {
        this.classGetOne.next(response);
      },
      (response: any) => {
        this.classGetOne.next(response);
      }
    )
  }

  insert(class_data) {
    return this.classCollection.add({ name: class_data.name });
  }

  update(class_id, class_data) {
    return this.classCollection.doc(class_id).update({ name: class_data.name });
  }

  delete(class_id) {
    return this.classCollection.doc(class_id).delete();
  }

}
