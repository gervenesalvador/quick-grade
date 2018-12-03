import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../model/user';
import { Student } from '../model/student';
import { Paper } from '../model/paper';
import { Exam } from '../model/exam';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.css']
})
export class PaperDetailComponent implements OnInit {
  // user_id:string;
  // usersCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  userAuth: Object;

  paper_id: string;
  papersCollection: AngularFirestoreCollection<Paper>;
  paperDoc: AngularFirestoreDocument<Paper>;
  paper: Observable<Paper>;

  examDoc: AngularFirestoreDocument<Exam>;
  exam: Observable<Exam>;

  studentDoc: AngularFirestoreDocument<Student>;
  student: Observable<Student>;

  paperDetails: Array<any> = [];

  objectKeys = Object.keys;
  
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    // private _iterableDiffers: IterableDiffers
  ) { 
    this.userAuth = this.authService.getUser();
    // this.user_id = this.route.snapshot.paramMap.get('id');
    this.paper_id = this.route.snapshot.paramMap.get('paperID');
    // this.paperDetails = this._iterableDiffers.find([]).create(null);
  }

  ngOnInit() {
    // this.usersCollection = this.afs.collection<User>('Users');
    // this.userDoc = this.usersCollection.doc(this.user_id);
    this.userDoc = this.afs.collection<User>('Users').doc(this.userAuth['id']);
    this.user = this.userDoc.valueChanges();

    this.papersCollection = this.userDoc.collection('Paper');
    this.paperDoc = this.papersCollection.doc(this.paper_id);
    this.paper = this.paperDoc
      .snapshotChanges().map(paper => {
        if (paper.payload.exists) {
          let paper_data = paper.payload.data();
          
          this.studentDoc = this.userDoc.collection('Student').doc(paper_data.studentId);
          this.student = this.studentDoc.valueChanges();
            
          this.examDoc = this.userDoc.collection('Exam').doc(paper_data.examId);
          this.exam = this.examDoc 
            .snapshotChanges().map(exam => {
              if (exam.payload.exists) {
                let exam_data = exam.payload.data();
                return { id: exam.payload.id, ...exam_data };
              }
            });
          return { id: paper.payload.id, ...paper_data };
        } else {
          this.location.back();
        }
      });

    this.paper.subscribe(paper => {
      this.paperDetails = paper.studentAnswers;
    });
  }
}
