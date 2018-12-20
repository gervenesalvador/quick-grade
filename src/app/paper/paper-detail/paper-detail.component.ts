import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { PaperService } from '../../services/paper.service';
import { ExamService } from '../../services/exam.service';
import { StudentService } from '../../services/student.service';

import { Paper } from '../../models/paper.model';
import { Exam } from '../../models/exam.model';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.css']
})
export class PaperDetailComponent implements OnInit, OnDestroy {
  paper_id: string;
  paper: Paper;
  exam: Exam;
  student: Student;

  paperSubscription: Subscription;
  examSubscription: Subscription;
  studentSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private paperService: PaperService,
    private examService: ExamService,
    private studentService: StudentService,
  ) {
    this.paper_id = this.route.snapshot.paramMap.get('paperID');
    this.paperService.getOne(this.paper_id);
  }

  ngOnInit() {
    this.paperSubscription = this.paperService.paperGetOne.subscribe(
      (response: any) => {
        this.paper = response;
        console.log(response);
        this.examService.getOne(response.examId);
        this.studentService.getOne(response.studentId);
      }
    );

    this.examSubscription = this.examService.examGetOne.subscribe(
      (response: any) => {
        this.exam = response;
        console.log(response);
      }
    );

    this.studentSubscription = this.studentService.studentGetOne.subscribe(
      (response: any) => {
        this.student = response;
        // console.log(response);
      }
    );
  }

  ngOnDestroy() {
    this.paperSubscription.unsubscribe();
    this.examSubscription.unsubscribe();
  }
}
