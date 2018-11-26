import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { Class } from '../model/class';
import { Exam } from '../model/exam';
import { Paper } from '../model/paper';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.css']
})
export class ExamDetailComponent implements OnInit {
  @ViewChild('delete_paper_modal') delete_paper_modal: ModalDirective;
  user_id: string;
  exam_id: string;
  usersCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  // divider: any = 0;
  passed: number = 0;
  failed: number = 0;

  examCollection: AngularFirestoreCollection<Exam>;
  examDoc: AngularFirestoreDocument<any>;
  exam: Observable<any>;

  // selectedPaperDoc: AngularFirestoreDocument<Paper>;
  selectedPaper: Observable<any>
  public chartType:string = 'pie';
  public chartData:Array<any> = [20, 50];
  public chartLabels:Array<any> = ['Passed', 'Failed'];

  public chartColors:Array<any> = [{
      hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
      hoverBorderWidth: 0,
      backgroundColor: ["#03d800", "#F7464A"],
      hoverBackgroundColor: ["#0ca90a","#FF5A5E"]
  }];

  public chartOptions:any = {
      responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
  ) {
    this.user_id = this.route.snapshot.paramMap.get('id');
    this.exam_id = this.route.snapshot.paramMap.get('examID');
  }

  ngOnInit() {
    this.usersCollection = this.afs.collection<User>('Users');
    this.userDoc = this.usersCollection.doc(this.user_id);
    this.user = this.userDoc.valueChanges();

    this.examCollection = this.userDoc.collection('Exam');
    this.examDoc = this.examCollection.doc(this.exam_id);
    this.exam = this.examDoc
      .snapshotChanges().map(exam => {
        let data = exam.payload.data();
        let temp_date = new Date(data['date'].toDate())
        data['date'] = temp_date.toDateString()+" "+temp_date.getHours()+":"+temp_date.getMinutes(); //(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":";
        if (data.classes) {
          let class_list = [];
          data.classes.forEach(class_id => {
            class_list.push(this.userDoc.collection('Class').doc(class_id)
              .snapshotChanges().map(class_data => {
                if (class_data.payload.exists) {
                  let class_da = class_data.payload.data();
                  return {id: class_data.payload.id, ...class_da};
                }
              }));
          });
          data.classesDatas = class_list;
        }

        data.papersDatas = this.userDoc.collection('Paper', ref => ref.where('examId', '==', this.exam_id))
          .snapshotChanges().map(papers => {
            return papers.map(paper => {
              let paper_data = paper.payload.doc.data();
              paper_data.studentData = this.userDoc.collection('Student').doc(paper_data.studentId).valueChanges();
              return { id: paper.payload.doc.id, ...paper_data };
            })
          });

        let temp_students = [];
        if (data.students) {
          data.students.forEach(student => {
            temp_students.push(this.userDoc.collection('Student').doc(student)
              .snapshotChanges().map(arr => {
                if (arr.payload.exists) {
                  return {id: arr.payload.id, ...arr.payload.data() };
                }
              })
            );
          });
        }
        data.studentsDatas = temp_students;
        return { id: exam.payload.id, ...data };
      });

    this.exam.subscribe(data => {
      let studentTemp = [];
      for (var s = 0; s < data.studentsDatas.length; s++) {
        data.studentsDatas[s].subscribe(student_data => {
          studentTemp.push(student_data);
        });
      }
      data.studentsDatas = studentTemp;
      data.papersDatas.subscribe(lala => {
        this.chartData = [];
        this.chartData = [lala.length, Math.floor((Math.random() * 50) + 1)];
      });
    })
  }

  showRemovePaperConfirmation(paper_id): void {
    console.log(paper_id);
    this.selectedPaper = this.userDoc.collection('Paper').doc(paper_id)
      .snapshotChanges().map(paper => {
        let paper_data = paper.payload.data();
        return { id: paper.payload.id, ...paper_data };
      });

    this.delete_paper_modal.show();
  }

  deletePaper(paper_id): void {
    this.userDoc.collection('Paper').doc(paper_id).delete();
    this.selectedPaper = null;
    this.delete_paper_modal.hide();
  }

}
