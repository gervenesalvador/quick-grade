import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { Student } from '../model/student';
import { Paper } from '../model/paper';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  user_id: string;
  student_id: string;
  usersCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  studentCollection: AngularFirestoreCollection<Student>;
  studentDoc: AngularFirestoreDocument<Student>;
  student: Observable<Student>;
  student_data: Object;

  paperCollection: AngularFirestoreCollection<Paper>;
  papers: Observable<Paper[]>;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
  ) { 
    this.user_id = this.route.snapshot.paramMap.get('id');
    this.student_id = this.route.snapshot.paramMap.get('studentID');
  }

  ngOnInit() {
    this.usersCollection = this.afs.collection<User>('Users');
    this.userDoc = this.usersCollection.doc(this.user_id);
    this.user = this.userDoc.valueChanges();

    this.studentCollection = this.userDoc.collection('Student');
    this.studentDoc = this.studentCollection.doc(this.student_id);
    this.student = this.studentDoc.valueChanges();

    this.paperCollection = this.userDoc.collection('Paper', ref => ref.where('studentId', '==', this.student_id));
    this.papers = this.paperCollection//.valueChanges();
      .snapshotChanges().map(paper =>{
        return paper.map(pape => {
          const data = pape.payload.doc.data() as Paper;
          return { id: pape.payload.doc.id, ...data };
        });
      })
  }

}
