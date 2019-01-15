import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ExamService } from '../../services/exam.service';
import { PaperService } from '../../services/paper.service';

import { Exam } from '../../models/exam.model';
import { Paper } from '../../models/paper.model';

@Component({
  selector: 'app-exam-papers',
  templateUrl: './exam-papers.component.html',
  styleUrls: ['./exam-papers.component.css']
})
export class ExamPapersComponent implements OnInit, OnDestroy {
  exam_id: string;
  exam: Exam;
  papers: Paper[] = [];

  examSubscription: Subscription;
  paperSubscription: Subscription;



  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private paperService: PaperService,
  ) {
    this.exam_id = this.route.snapshot.paramMap.get('examID');
    this.examService.getOne(this.exam_id);
    this.paperService.getAllExam(this.exam_id);
  }

  ngOnInit() {
    this.examSubscription = this.examService.examGetOne.subscribe(
      (response: any) => {
        this.exam = response;
        console.log(response);
      }
    );

    this.paperSubscription = this.paperService.paperGetAll.subscribe(
      (response: any) => {
        this.papers = response;
        console.log(response);
      }
    );
  }

  ngOnDestroy() {
    this.examSubscription.unsubscribe();
    this.paperSubscription.unsubscribe();
  }

}
