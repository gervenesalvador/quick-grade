import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

import { Student } from '../models/student.model';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  studentGetAll = new Subject<Student[]>();
  studentGetOne = new Subject<Student>();
  userAuth: any;
  studentCollection: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.userAuth = this.authService.getUser();
    this.studentCollection = this.afs.collection('Users').doc(this.userAuth['id']).collection<Student>('Student');
  }

  getAll() {
    return this.studentCollection.snapshotChanges()
    .map(
      (response: any) => {
        return response.map(
          (data: any) => {
            let cl = data.payload.doc.data() as Student;
            return { id: data.payload.doc.id, ...cl };
          }
        );
      }
    ).subscribe(
      (response: any) => {
        this.studentGetAll.next(response);
      },
      (response: any) => {
        this.studentGetAll.next(response.error);
      }
    );
  }

  getOne(exam_uid) {
    return this.studentCollection.doc(exam_uid).snapshotChanges()
    .map(
      (data: any) => {
        return { id: data.payload.id, ...data.payload.data() };
      }
    ).subscribe(
      (response: any) => {
        this.studentGetOne.next(response);
      },
      (response: any) => {
        this.studentGetOne.next(response);
      }
    );
  }

  insert(exam_data) {
    return this.studentCollection.add(exam_data);
  }

  update(student_id, student_data) {
    return this.studentCollection.doc(student_id).update(student_data);
  }

  delete(student_id) {
    return this.studentCollection.doc(student_id).delete();
  }
}
