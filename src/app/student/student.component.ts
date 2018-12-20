import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ModalDirective } from 'angular-bootstrap-md';

import { StudentService } from '../services/student.service';
import { ClassService } from '../services/class.service';

import { Student } from '../models/student.model';
import { Class } from '../models/class.model';

// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import { ActivatedRoute } from '@angular/router';
// import { User } from '../model/user';
// import { Student } from '../model/student';
// import { Exam } from '../model/exam';

// import { Angular5Csv } from 'angular5-csv/Angular5-csv';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnDestroy {
  @ViewChild('delete_exam') delete_exam: ModalDirective;
  @ViewChild('create_student') create_student: ModalDirective;
  @ViewChild('create_class') create_class: ModalDirective;
  // user_id: string;
  // usersCollection: AngularFirestoreCollection<User>;
  // userDoc: AngularFirestoreDocument<User>;
  // user: Observable<User>;
  // userAuth: Object;

  // studentCollection: AngularFirestoreCollection<Student>;
  // students: Observable<Student[]>;
  
  // classCollection: AngularFirestoreCollection<Exam>;
  // class_list: Observable<Exam[]>;
  // classForm: Array<any> = [];
  // buildClass: Array<any> = [];

  // selectedStudent: string;
  // selectedStudentName: string;

  studentForm = this.formBuilder.group({
    student_id: [''],
    customID: [''],
    firstName: [''],
    lastName: [''],
    classes: new FormArray([]),
  });
  classForm = this.formBuilder.group({
    name: [''],
  });

  // classFormHtml = this.fb.group({
  //   name: [''],
  // });

  createStudentTitle: string;
  studentFormClassList: Array<any> = [];
  // container: any;
  // tempStudents: Array<any> = [];
  students: Student[];
  classes: Class[];

  studentSubscription: Subscription;
  classSubscription: Subscription;

  selectedStudent: Object = {};

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    // private afs: AngularFirestore,
    // private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    // private authService: AuthService,
  ) {
    this.studentService.getAll();
    this.classService.getAll();
    // this.userAuth = this.authService.getUser();
    // // this.user_id = this.route.snapshot.paramMap.get('id');
    this.createStudentTitle = 'Add New Student';
  }

  get studentFormclasses() {
    return this.studentForm.get('classes') as FormArray;
  }

  // addclasses() {
  //   this.classes.push(this.fb.control(''));
  // }

  ngOnInit() {
    this.studentSubscription = this.studentService.studentGetAll.subscribe(
      (response: any) => {
        this.students = response;
        // for(let i = 0; i < response.length; i++){
        //   this.classes.push(this.formBuilder.control(''));
        // }
      }
    );

    this.classSubscription = this.classService.classGetAll.subscribe(
      (response: any) => {
        this.classes = response;
        for(let i = 0; i < response.length; i++){
          this.studentFormclasses.push(this.formBuilder.control(''));
          this.studentFormClassList.push({ class_id: response[i].id, html_id: 'user-'+i, name: response[i].name });
        }
        // console.log(response);
      }
    );

    // this.usersCollection = this.afs.collection<User>('Users');
    // this.userDoc = this.usersCollection.doc(this.user_id);
    // this.userDoc = this.afs.collection<User>('Users').doc(this.userAuth['id']);
    // this.user = this.userDoc.valueChanges();

    // this.studentCollection = this.userDoc.collection('Student');
    // this.students = this.studentCollection.snapshotChanges()
    //   .map((arr) => {
    //     // console.log(arr);
    //     return arr.map(a => {
    //       let data = a.payload.doc.data() as Student;
    //       let id = a.payload.doc.id;
    //       return { id, ...data };
    //     });
    //   });
    
    // this.tempStudents.push({
    //   "Student ID": "Student ID",
    //   "Name": "Name",
    // })
    // this.students.subscribe(students => {
    //   students.forEach(student => {
    //     this.tempStudents.push({
    //       "Student ID": student.customID,
    //       "Name": student.firstName+" "+student.lastName
    //     })
    //   })
    // })

    // this.classCollection = this.userDoc.collection('Class');
    // this.class_list = this.classCollection.snapshotChanges()
    //   .map((arr) => {
    //     return arr.map((a) => {
    //       const data = a.payload.doc.data() as Exam;
    //       const id = a.payload.doc.id;
    //       return { id, ...data };
    //     });
    //   });
    
    // this.class_list.subscribe(classes => {
    //   classes.forEach((data, i) => {
    //     this.addclasses();
    //     this.classForm.push({class_id: data['id'], html_id: 'user-'+i, class_name: data['name']});
    //   })
    // });
  }

  showStudentCreate() {
    this.createStudentTitle = 'Add New Student';
    this.create_student.show();
  }

  studentFormCreate() {
    let request = this.studentForm.value;
    let student_classes = request.classes.map((arr, key) => {
      if (arr) { 
        return this.studentFormClassList[key].class_id; 
      }
      return false;
    });
    student_classes = student_classes.filter(Boolean);

    if (request.student_id) {
      let exam = {
        classes: student_classes,
        customID: request.customID,
        firstName: request.firstName,
        lastName: request.lastName,
      };
      this.studentService.update(request.student_id, exam);
      return true;
    }

    this.studentService.insert({
      classes: student_classes,
      customID: request.customID,
      exams: [],
      firstName: request.firstName,
      lastName: request.lastName,
    });

    this.studentForm.reset();
    this.create_student.hide();
  }
  studentEdit(student) {
    console.log(student);
    this.studentForm.reset();
    let student_classes = [];
    for (let i = 0; i < this.studentFormClassList.length; i++) {
      student_classes.push(false);
    }
    if (student.classes) {
      for (let i = 0; i < this.studentFormClassList.length; i++) {
        if (student.classes.includes(this.studentFormClassList[i].class_id)) {
          student_classes[i] = true;
        } 
      }
    }

    this.studentForm.setValue({
      student_id: student.id,
      customID: student.customID,
      firstName: student.firstName,
      lastName: student.lastName,
      classes: student_classes,
    });

    this.createStudentTitle = 'Edit ' + student.firstName + ' ' + student.lastName;
    this.create_student.show();
  }
  studentDeleteConfirmation(student_id, student_name) {
    this.selectedStudent = {
      id: student_id,
      name: student_name,
    }
    this.delete_exam.show();
  }
  studentDelete(student_id) {
    this.studentService.delete(student_id);
    this.delete_exam.hide();
    this.selectedStudent = {};
  }

   classFormOnSubmit() {
    let class_data = this.classForm.value;
    this.classService.insert(class_data);
    this.create_class.hide();
    this.classForm.reset()
  }

  // studentFormCreateOnSubmit(): void {
    // this.userModalTitle = 'Add New Student';
    // let exam_class = this.studentFormCreate.value.classes.map((arr, key) => {
    //   if (arr) { return this.classForm[key].class_id; }
    //   return false;
    // });
    // exam_class = exam_class.filter(Boolean);

    // let data = this.studentFormCreate.value;
    // data.classes = exam_class;
    // if (this.studentFormCreate.value.student_id) {
    //   this.studentCollection.doc(this.studentFormCreate.value.student_id).update(data);
    // } else {
    //   this.studentCollection.add(data);
    // }
    
    // this.studentFormCreate.reset();
  // }

  // deleteStudentConfimation(student_id, student_name): void {
    // this.selectedStudent = student_id;
    // this.selectedStudentName = student_name;
    // this.delete_exam.show();
  // }

  // deleteStudent(): void {
    // this.studentCollection.doc(this.selectedStudent).delete();
    // this.delete_exam.hide();
    // this.selectedStudent = null;
    // this.selectedStudentName = null;
  // }

  // editStudent(student): void {
    // console.log(student);
    // let class_temp = [];
    // for (let i = 0; i < this.classForm.length; i++) {
    //   class_temp.push(false);
    // }
    
    // if (student.classes) {
    //   for (let i = 0; i < this.classForm.length; i++) {
    //     if (student.classes.includes(this.classForm[i].class_id)) {
    //       class_temp[i] = true;
    //     } 
    //   }
    // }
    // // console.log(class_temp);
    // this.studentFormCreate.setValue({
    //   student_id: student.id,
    //   customID: student.customID,
    //   firstName: student.firstName,
    //   lastName: student.lastName,
    //   classes: class_temp
    // });
    // this.userModalTitle = 'Edit '+student.firstName+' '+student.flastnameName+' Student';
    // this.create_student_modal.show();
  // }

  // export_all_student(): void {
    // new Angular5Csv(this.tempStudents, 'Students');
  // }

  // classFormOnSubmit(): void {
    // this.studentFormCreate = this.fb.group({
    //   student_id: [''],
    //   customID: [''],
    //   firstName: [''],
    //   lastName: [''],
    //   classes: new FormArray(this.buildClass),
    // });
    
    // this.classCollection.add(this.classFormHtml.value);
    
    // this.create_class.hide();
    // this.classFormHtml.reset();
  // }

  ngOnDestroy() {
    this.studentSubscription.unsubscribe();
    this.classSubscription.unsubscribe();
  }
}
