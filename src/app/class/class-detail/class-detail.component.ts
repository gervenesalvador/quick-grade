import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { ClassService } from '../../services/class.service';
import { ExamService } from '../../services/exam.service';
import { StudentService } from '../../services/student.service';
import { PaperService } from '../../services/paper.service';

import { Class } from '../../models/class.model';
import { Exam } from '../../models/exam.model';
import { Student } from '../../models/student.model';
import { Paper } from '../../models/paper.model';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit, OnDestroy {
  class_id: string;
  class_data: Class;
  exams: Exam[] = [];
  students: Student[] = [];
  papers: Paper[] = [];

  sClassSubscription: Subscription;
  examSubscription: Subscription;
  studentSubscription: Subscription;
  paperSubscription: Subscription;

  csv_title = {
    student_id: "Student ID",
    student_name: "Student Name",
  };
  // DO NOT DELETE - FOR PATTERN
  csv_container = { // DO NOT DELETE - FOR PATTERN
    student_id: "Student ID",// DO NOT DELETE - FOR PATTERN
    student_name: "Student Name",// DO NOT DELETE - FOR PATTERN
  };// DO NOT DELETE - FOR PATTERN
  // DO NOT DELETE - FOR PATTERN
  csv_students = {};
  ready_export = 0;

  constructor(
    private classService: ClassService, 
    private route: ActivatedRoute,
    private examService: ExamService,
    private studentService: StudentService,
    private paperService: PaperService,
  ) {
    this.class_id = this.route.snapshot.paramMap.get('classID');
    this.classService.getOne(this.class_id);
  }

  ngOnInit() {
    this.examSubscription = this.examService.examGetOne.subscribe(
      (response: Exam) => {
        if (response.name) {
          let date = new Date(response.date.toDate())
          response.date = date.toDateString()+" "+date.getHours()+":"+date.getMinutes();
          this.exams.push(response);
          this.csv_title[response.name] = response.name;
          this.csv_container[response.id] = 0;
        }
      }
    );

    this.studentSubscription = this.studentService.studentGetOne.subscribe(
      (response: any) => {
        this.students.push(response);

        let csv_container = this.clone(this.csv_container);
        csv_container['student_id'] = response.customID;
        csv_container['student_name'] = response.firstName + " " + response.firstName;
        this.csv_students[response.id] = csv_container;
      }
    );

    this.paperSubscription = this.paperService.paperGetOne.subscribe(
      (response: any) => {
        if (response.length) {
          this.csv_students[response[0].studentId][response[0].examId] = response[0].score;
          this.ready_export = 1;
        }
      }
    );

    this.sClassSubscription = this.classService.classGetOne.subscribe(
      (response: any) => {
        this.class_data = response;
        if (response.exams) {
          for (let i = 0; i < response.exams.length; i++) {
            this.examService.getOne(response.exams[i]);
          }
        }
        if (response.students) {
          for (let i = 0; i < response.students.length; i++) {
            this.studentService.getOne(response.students[i]);

            if (response.exams) {
              for (let e = 0; e < response.exams.length; e++) {
                this.paperService.getByExamAndStudent(response.exams[e], response.students[i]);
              }
            }
          }
        }
      }
    );
  }

  export_all_student() {
    let csv = [];
    let csv_student = Object.getOwnPropertyNames(this.csv_students);
    csv.push(this.csv_title);
    for (let i = 0; i < csv_student.length; ++i) {
      csv.push(this.csv_students[csv_student[i]]);
    }
    new Angular5Csv(csv, this.class_data.name);
  }

  ngOnDestroy() {
    this.sClassSubscription.unsubscribe();
    this.studentSubscription.unsubscribe();
    this.examSubscription.unsubscribe();
  }

  clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }

    return copy;
  }
}
