import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ModalDirective } from 'angular-bootstrap-md';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

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
  ready_import = 1;

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

  export_all_student() {
    let csv = [],
    _students = this.students;
    csv.push({
      student_id: "Student ID",
      firstname: "First name",
      lastname: "Last name"
    });
    for (let key of Object.keys(_students)) {
      let student = _students[key];
      csv.push({
        student_id: student.customID,
        firstname: student.firstName,
        lastname: student.lastName,
      })
    }
    this.ready_import = 1;
    new Angular5Csv(csv, "Students");
  }

  import_students(input) {
    if (input.target.files && input.target.files[0] && this.ready_import) {
      let file = input.target.files[0],  reader = new FileReader();

      reader.readAsText(file);
      reader.onload = (event: any) => {
        let csv = event.target.result,
        allTextLines = csv.split(/\r\n|\n/);
        
        for (let i = 1; i < allTextLines.length; i++) {
          let data = allTextLines[i].split(',');
          for (let j = 0; j < data.length; j++) {
            if (data[j].includes(`"`)) {
              data[j] = data[j].substring(1, data[j].length-1);
            }
          }
          let student = this.students.filter(obj => { return obj.customID === data[0]});
          if (student.length <= 0) { continue; }
          let _student = student[0],
          _student_id = _student.id;
          _student.firstName = data[1];
          _student.lastName = data[2];

          delete _student.id;
          this.studentService.update(_student_id, _student);
          
        }
        alert("Done Updating students name");
      }
    }
  }

  ngOnDestroy() {
    this.studentSubscription.unsubscribe();
    this.classSubscription.unsubscribe();
  }
}
