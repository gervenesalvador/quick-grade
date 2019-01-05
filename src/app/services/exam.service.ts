import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

import { Exam } from '../models/exam.model';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  examGetAll = new Subject<Exam[]>();
  examGetOne = new Subject<Exam>();
  userAuth: any;
  examCollection: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.userAuth = this.authService.getUser();
    this.examCollection = this.afs.collection('Users').doc(this.userAuth['id']).collection<Exam>('Exam');
  }

  getAll() {
    return this.examCollection.snapshotChanges()
    .map(
      (response: any) => {
        return response.map(
          (data: any) => {
            let cl = data.payload.doc.data() as Exam;
            return { id: data.payload.doc.id, ...cl };
          }
        );
      }
    ).subscribe(
      (response: any) => {
        this.examGetAll.next(response);
      },
      (response: any) => {
        this.examGetAll.next(response.error);
      }
    );
  }

  getOne(exam_uid) {
    return this.examCollection.doc(exam_uid).snapshotChanges()
    .map(
      (data: any) => {
        return { id: data.payload.id, ...data.payload.data() };
      }
    ).subscribe(
      (response: any) => {
        this.examGetOne.next(response);
      },
      (response: any) => {
        this.examGetOne.next(response);
      }
    );
  }

  insert(exam_data) {
    return this.examCollection.add(exam_data);
  }

  update(exam_id, exam_data) {
    this.delete(exam_id);
    return this.examCollection.doc(exam_id).set(exam_data);
  }

  delete(exam_id) {
    return this.examCollection.doc(exam_id).delete();
  }

}
