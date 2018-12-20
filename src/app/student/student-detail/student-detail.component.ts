import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { StudentService } from '../../services/student.service';
import { PaperService } from '../../services/paper.service';

import { Student } from '../../models/student.model';
import { Paper } from '../../models/paper.model';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit, OnDestroy {
  student_id: string;
  student: Student;
  papers: Paper[];

  studentSubscription: Subscription;
  paperSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private paperService: PaperService,
  ) {
    this.student_id = this.route.snapshot.paramMap.get('studentID');
    this.studentService.getOne(this.student_id);
    this.paperService.getAllStudent(this.student_id);
  }

  ngOnInit() {
    this.studentSubscription = this.studentService.studentGetOne.subscribe(
      (response: any) => {
        this.student = response;
      }
    );

    this.paperSubscription = this.paperService.paperGetAll.subscribe(
      (response: any) => {
        this.papers = response;
        // console.log(response);
      }
    );
  }

  ngOnDestroy() {

  }
}
