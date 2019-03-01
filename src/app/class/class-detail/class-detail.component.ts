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
  ready_import = 0;

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
        csv_container['student_name'] = response.firstName + " " + response.lastName;
        this.csv_students[response.id] = csv_container;
      }
    );

    this.paperSubscription = this.paperService.paperGetOne.subscribe(
      (response: any) => {
        if (response.length) {
          this.papers.push(response[0]);
          // console.log(response[0].id + " | " + response[0].score);
          this.csv_students[response[0].studentId][response[0].examId] = (typeof response[0].score !== 'undefined') ? response[0].score : 0;
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
    this.ready_import = 1;
    new Angular5Csv(csv, this.class_data.name);
  }

  fileChangeEvent(input) {
    // console.log(this.exams);
    if (input.target.files && input.target.files[0] && this.ready_import) {
      let file = input.target.files[0],
          reader = new FileReader(),
          upload_csv = [];

      reader.readAsText(file);
      reader.onload = (event: any) => { //function(event :any) {
        let csv = event.target.result,
        allTextLines = csv.split(/\r\n|\n/),
        first_line,
        subjects = [],
        total_subjects = 0;
        for (let i = 0; i < allTextLines.length; i++) {
          let data = allTextLines[i].split(',');
          for (let j = 0; j < data.length; j++) {
            if (data[j].includes(`"`)) {
              data[j] = data[j].substring(1, data[j].length-1);
            }
          }
          if (i == 0) {
            first_line = data;
            continue;
          }
          if (data.length > 0) {
            upload_csv.push(data);
          }
        }

        total_subjects = first_line.length -2;
        for (let s = 0; s < total_subjects; s++) {
          subjects.push(first_line[s + 2]);
        }

        for (let c = 0; c < upload_csv.length; c++) {
          let customid = 0,
          student = this.students.filter(obj => {
            return obj.customID === upload_csv[c][customid];
          })[0];
          if (typeof student === 'undefined') {
            continue;
          }

          for (let s = 0; s < subjects.length; s++) {
            let exam = this.exams.filter(obj => {
              return obj.name === subjects[s];
            })[0];

            let paper = this.papers.filter(obj => {
              return obj.examId === exam.id &&
                obj.studentId == student.id;
            });

            if (paper.length > 0) {
              // UPDATE PAPER SCORE
              let paper_id = paper[0].id;
              
              let temp_paper = paper[0];
              delete temp_paper.id;
              temp_paper.score = parseInt(upload_csv[c][s + 2]);
              
              this.paperService.update(paper_id, temp_paper);
              // console.log(paper);
            }
          }
        }
        alert("Successfully updated students scores");
      };
    }
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
