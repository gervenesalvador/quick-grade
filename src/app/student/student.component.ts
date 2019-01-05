import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ModalDirective } from 'angular-bootstrap-md';

import { StudentService } from '../services/student.service';
import { ClassService } from '../services/class.service';

import { Student } from '../models/student.model';
import { Class } from '../models/class.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnDestroy {
  @ViewChild('delete_exam') delete_exam: ModalDirective;
  @ViewChild('create_student') create_student: ModalDirective;
  @ViewChild('create_class') create_class: ModalDirective;

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

  createStudentTitle: string;
  studentFormClassList: Array<any> = [];
  students: Student[];
  classes: Class[];

  studentSubscription: Subscription;
  classSubscription: Subscription;

  selectedStudent: any = {};

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private formBuilder: FormBuilder,
  ) {
    this.studentService.getAll();
    this.classService.getAll();
    this.createStudentTitle = 'Add New Student';
  }

  get studentFormclasses() {
    return this.studentForm.get('classes') as FormArray;
  }

  ngOnInit() {
    this.studentSubscription = this.studentService.studentGetAll.subscribe(
      (response: any) => {
        this.students = response;
      }
    );

    this.classSubscription = this.classService.classGetAll.subscribe(
      (response: any) => {
        this.classes = response;
        for(let i = 0; i < response.length; i++){
          this.studentFormclasses.push(this.formBuilder.control(''));
          this.studentFormClassList.push({ class_id: response[i].id, html_id: 'user-'+i, name: response[i].name });
        }
      }
    );
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
      this.selectedStudent.classes = student_classes;
      this.selectedStudent.customID = request.customID;
      this.selectedStudent.firstName = request.firstName;
      this.selectedStudent.lastName = request.lastName;
      this.studentService.update(request.student_id, this.selectedStudent);
    } else {
      this.studentService.insert({
        classes: student_classes,
        customID: request.customID,
        exams: [],
        firstName: request.firstName,
        lastName: request.lastName,
      });
    }

    this.studentForm.reset();
    this.create_student.hide();
  }

  studentEdit(student) {
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

    this.selectedStudent = student;
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

  ngOnDestroy() {
    this.studentSubscription.unsubscribe();
    this.classSubscription.unsubscribe();
  }
}
