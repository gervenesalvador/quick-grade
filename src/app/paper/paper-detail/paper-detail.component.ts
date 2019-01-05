import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { ModalDirective } from 'angular-bootstrap-md';
import { FormGroup, FormControl } from '@angular/forms';

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
  @ViewChild('studentPaperUpdateAnswer') studentPaperUpdateAnswer: ModalDirective;

  paperForm = new FormGroup({
    answer: new FormControl(''),
    x: new FormControl(''),
    is_correct: new FormControl(''),
  });

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
        if (response.examId && response.studentId) {
          this.paper = response;
          this.examService.getOne(response.examId);
          this.studentService.getOne(response.studentId);
        }
      }
    );

    this.examSubscription = this.examService.examGetOne.subscribe(
      (response: any) => {
        this.exam = response;
      }
    );

    this.studentSubscription = this.studentService.studentGetOne.subscribe(
      (response: any) => {
        this.student = response;
      }
    );
  }

  paperEdit(i) {
    this.paperForm.reset();
    let studentAnswers = this.paper.studentAnswers[+i];
    this.paperForm.setValue({
      x: i,
      answer: studentAnswers.answer,
      is_correct: studentAnswers.correct,
    });
    this.studentPaperUpdateAnswer.show();
  }

  paperFormOnSubmit() {
    let request = this.paperForm.value;
    this.paper.studentAnswers[request.x].answer = request.answer;
    this.paper.studentAnswers[request.x].correct = request.is_correct;
    this.paperService.update(this.paper_id, this.paper);

    this.paperForm.reset();
    this.studentPaperUpdateAnswer.hide();
  }

  ngOnDestroy() {
    this.paperSubscription.unsubscribe();
    this.examSubscription.unsubscribe();
  }
}
