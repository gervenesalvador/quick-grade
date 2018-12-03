import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { Student } from '../model/student';
import { Exam } from '../model/exam';
import { FormBuilder, FormArray } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  @ViewChild('delete_exam') delete_exam: ModalDirective;
  @ViewChild('create_student_modal') create_student_modal: ModalDirective;
  @ViewChild('create_class') create_class: ModalDirective;
  // user_id: string;
  // usersCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  userAuth: Object;

  studentCollection: AngularFirestoreCollection<Student>;
  students: Observable<Student[]>;
  
  classCollection: AngularFirestoreCollection<Exam>;
  class_list: Observable<Exam[]>;
  classForm: Array<any> = [];
  buildClass: Array<any> = [];

  selectedStudent: string;
  selectedStudentName: string;

  studentFormCreate = this.fb.group({
    student_id: [''],
    customID: [''],
    firstName: [''],
    lastName: [''],
    classes: new FormArray(this.buildClass),
  });

  classFormHtml = this.fb.group({
    name: [''],
  });

  userModalTitle: string;

  container: any;
  tempStudents: Array<any> = [];
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
  ) { 
    this.userAuth = this.authService.getUser();
    // this.user_id = this.route.snapshot.paramMap.get('id');
    this.userModalTitle = 'Add New Student';
  }

  get classes() {
    return this.studentFormCreate.get('classes') as FormArray;
  }

  addclasses() {
    this.classes.push(this.fb.control(''));
  }

  ngOnInit() {
    // this.usersCollection = this.afs.collection<User>('Users');
    // this.userDoc = this.usersCollection.doc(this.user_id);
    this.userDoc = this.afs.collection<User>('Users').doc(this.userAuth['id']);
    this.user = this.userDoc.valueChanges();

    this.studentCollection = this.userDoc.collection('Student');
    this.students = this.studentCollection.snapshotChanges()
      .map((arr) => {
        // console.log(arr);
        return arr.map(a => {
          let data = a.payload.doc.data() as Student;
          let id = a.payload.doc.id;
          return { id, ...data };
        });
      });
    
    this.tempStudents.push({
      "Student ID": "Student ID",
      "Name": "Name",
    })
    this.students.subscribe(students => {
      students.forEach(student => {
        this.tempStudents.push({
          "Student ID": student.customID,
          "Name": student.firstName+" "+student.lastName
        })
      })
    })

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

  studentFormCreateOnSubmit(): void {
    this.userModalTitle = 'Add New Student';
    let exam_class = this.studentFormCreate.value.classes.map((arr, key) => {
      if (arr) { return this.classForm[key].class_id; }
      return false;
    });
    exam_class = exam_class.filter(Boolean);

    let data = this.studentFormCreate.value;
    data.classes = exam_class;
    if (this.studentFormCreate.value.student_id) {
      this.studentCollection.doc(this.studentFormCreate.value.student_id).update(data);
    } else {
      this.studentCollection.add(data);
    }
    
    this.studentFormCreate.reset();
  }

  deleteStudentConfimation(student_id, student_name): void {
    this.selectedStudent = student_id;
    this.selectedStudentName = student_name;
    this.delete_exam.show();
  }

  deleteStudent(): void {
    this.studentCollection.doc(this.selectedStudent).delete();
    this.delete_exam.hide();
    this.selectedStudent = null;
    this.selectedStudentName = null;
  }

  editStudent(student): void {
    // console.log(student);
    let class_temp = [];
    for (let i = 0; i < this.classForm.length; i++) {
      class_temp.push(false);
    }
    
    if (student.classes) {
      for (let i = 0; i < this.classForm.length; i++) {
        if (student.classes.includes(this.classForm[i].class_id)) {
          class_temp[i] = true;
        } 
      }
    }
    // console.log(class_temp);
    this.studentFormCreate.setValue({
      student_id: student.id,
      customID: student.customID,
      firstName: student.firstName,
      lastName: student.lastName,
      classes: class_temp
    });
    this.userModalTitle = 'Edit '+student.firstName+' '+student.flastnameName+' Student';
    this.create_student_modal.show();
  }

  export_all_student(): void {

    new Angular5Csv(this.tempStudents, 'Students');
  }

  classFormOnSubmit(): void {
    this.studentFormCreate = this.fb.group({
      student_id: [''],
      customID: [''],
      firstName: [''],
      lastName: [''],
      classes: new FormArray(this.buildClass),
    });
    
    this.classCollection.add(this.classFormHtml.value);
    
    this.create_class.hide();
    this.classFormHtml.reset();
  }
}
