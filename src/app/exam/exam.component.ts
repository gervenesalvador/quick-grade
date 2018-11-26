import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { Exam } from '../model/exam';
import { FormBuilder, FormArray } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  @ViewChild('create_exam') create_exam : ModalDirective;
  @ViewChild('create_class') create_class: ModalDirective;
  user_id: string;
  usersCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  // classCollection: AngularFirestoreCollection<Class>;
  // classes: Observable<Class[]>;
  ExamCollection: AngularFirestoreCollection<any>;
  exams: Observable<Exam[]>;

  classCollection: AngularFirestoreCollection<Exam>;
  class_list: Observable<Exam[]>;
  classForm: Array<any> = [];
  buildClass: Array<any> = [];

  examForm = this.fb.group({
    exam_id: [''],
    name: [''],
    date: [''],
    classes: new FormArray(this.buildClass),
  });

  classFormHtml = this.fb.group({
    name: [''],
  });
  createExamModalTitle: string;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.user_id = this.route.snapshot.paramMap.get('id');
    this.createExamModalTitle = "Add Exam";
  }

  get classes() {
    return this.examForm.get('classes') as FormArray;
  }

  addclasses() {
    this.classes.push(this.fb.control(''));
  }
  
  ngOnInit() {
    this.usersCollection = this.afs.collection<User>('Users');
    this.userDoc = this.usersCollection.doc(this.user_id);
    this.user = this.userDoc.valueChanges();

    this.ExamCollection = this.userDoc.collection('Exam');
    this.exams = this.ExamCollection.snapshotChanges()
      .map((arr) => {
        // console.log(arr);
        return arr.map((a) => {
          
          let data = a.payload.doc.data();
          let date = new Date(data['date'].toDate());
          data.date = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
          return { id: a.payload.doc.id, ...data };
        });
      });
  
    this.classCollection = this.userDoc.collection('Class');
    this.class_list = this.classCollection.snapshotChanges()
      .map((arr) => {
        return arr.map((a) => {
          const data = a.payload.doc.data() as Exam;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
    
    this.class_list.subscribe(classes => {
      classes.forEach((data, i) => {
        this.addclasses();
        this.classForm.push({class_id: data['id'], html_id: 'user-'+i, class_name: data['name']});
      })
    });
  }

  examFormOnSubmit() {
    let exam_class = this.examForm.value.classes.map((arr, key) => {
      if (arr) { 
        return this.classForm[key].class_id; 
      }
      return false;
    });
    exam_class = exam_class.filter(Boolean);

    let data = this.examForm.value;
    data.date = new Date(data.date);
    data.classes = exam_class;

    if (data.exam_id) {
      let temp_exam = this.ExamCollection.doc(data.exam_id);
      delete data.exam_id;
      temp_exam.update(data)
    }
    this.createExamModalTitle = "Add Exam";
    this.ExamCollection.add(data);
    this.examForm.reset();
  }

  examDelete(exam_id): void {
    this.ExamCollection.doc(exam_id).delete();
  }

  editExam(exam): void {
    let class_temp = [];
    for (let i = 0; i < this.classForm.length; i++) {
      class_temp.push(false);
    }
    
    if (exam.classes) {
      for (let i = 0; i < this.classForm.length; i++) {
        if (exam.classes.includes(this.classForm[i].class_id)) {
          class_temp[i] = true;
        } 
      }
    }
    this.examForm.setValue({
      exam_id: exam.id,
      name: exam.name,
      date: exam.date,
      classes: class_temp,
    });
    this.createExamModalTitle = "Edit "+ exam.name +" Exam";
    this.create_exam.show();
  }

  closeExamModal(): void {
    this.createExamModalTitle = "Add Exam";
    this.create_exam.hide();
  }

  classFormOnSubmit(): void {
    // console.log("submited class form");
    this.classForm = [];
    this.classCollection.add(this.classFormHtml.value);
    
    this.create_class.hide();
    this.classFormHtml.reset();
  }
}
