import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

import { Paper } from '../models/paper.model';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  paperGetAll = new Subject<Paper[]>();
  paperGetOne = new Subject<Paper>();
  // paperQuery = new Subject<any>();
  
  userAuth: any;
  userDoc: AngularFirestoreDocument;

  paperCollection: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.userAuth = this.authService.getUser();
    this.userDoc = this.afs.collection('Users').doc(this.userAuth['id'])
    this.paperCollection = this.userDoc.collection<Paper>('Paper');
  }

  getAll() {
    return this.paperCollection.snapshotChanges()
    .map(
      (response: any) => {
        return response.map(
          (data: any) => {
            let cl = data.payload.doc.data() as Paper;
            return { id: data.payload.doc.id, ...cl };
          }
        );
      }
    ).subscribe(
      (response: any) => {
        this.paperGetAll.next(response);
      },
      (response: any) => {
        this.paperGetAll.next(response.error);
      }
    );
  }

  getAllExam(exam_id) {
    return this.userDoc.collection('Paper', (ref) => 
      ref.where('examId', '==', exam_id))
      .snapshotChanges().map(
        (response: any) => {
          return response.map(
            (data) => {
              let exam = data.payload.doc.data();
              let student = this.userDoc.collection('Student').doc(exam.studentId).valueChanges();
              return { id: data.payload.doc.id, student: student, ...exam };
            }
          );
        }
      ).subscribe(
        (response: any) => {
          this.paperGetAll.next(response);
        },
        (reponse: any) => {
          this.paperGetAll.next()
        }
      );
  }
  getAllStudent(student_id) {
     return this.userDoc.collection('Paper', (ref) => 
      ref.where('studentId', '==', student_id))
      .snapshotChanges().map(
        (response: any) => {
          return response.map(
            (data) => {
              let exam = data.payload.doc.data();
              return { id: data.payload.doc.id, ...exam };
            }
          );
        }
      ).subscribe(
        (response: any) => {
          this.paperGetAll.next(response);
        },
        (reponse: any) => {
          this.paperGetAll.next()
        }
      );
  }

  getByExamAndStudent(exam_id, student_id) {
    return this.afs.collection('Users').doc(this.userAuth['id'])
      .collection<Paper>('Paper', (ref) => 
        ref.where('examId', '==', exam_id).where('studentId', '==', student_id))
      .snapshotChanges().map(
        (response: any) => {
          return response.map(
            (data: any) => {
              return { id: data.payload.doc.id, ...data.payload.doc.data() as Paper };
            }
          );
        }
      ).subscribe(
        (response: any) => {
          this.paperGetOne.next(response);
        },
        (response: any) => {
          this.paperGetOne.next(response);
        }
      );
  }

  getOne(class_uid) {
    return this.paperCollection.doc(class_uid).snapshotChanges()
    .map(
      (data: any) => {
        return { id: data.payload.id, ...data.payload.data() };
      }
    ).subscribe(
      (response: any) => {
        this.paperGetOne.next(response);
      },
      (response: any) => {
        this.paperGetOne.next(response);
      }
    );
  }

  insert(exam_data) {
    return this.paperCollection.add(exam_data);
  }

  update(exam_id, exam_data) {
    return this.paperCollection.doc(exam_id).update({ name: exam_data.name });
  }

  delete(exam_id) {
    return this.paperCollection.doc(exam_id).delete();
  }
  
}
