import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { ModalDirective } from 'angular-bootstrap-md';

import { ExamService } from '../../services/exam.service';
import { ClassService } from '../../services/class.service';
import { PaperService } from '../../services/paper.service';

import { Exam } from '../../models/exam.model';
import { Class } from '../../models/class.model';
import { Paper } from '../../models/paper.model';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.css']
})
export class ExamDetailComponent implements OnInit, OnDestroy {
  @ViewChild('delete_paper') delete_paper : ModalDirective;

  exam_id: string;
  selected_paper = {};

  exam: Exam;
  classes: Class[] = [];
  papers: Paper[] = [];

  examSubscription: Subscription;
  classSubscription: Subscription;
  paperSubscription: Subscription;

  chartData:Array<any> = [1, 1];
  chartLabels:Array<any> = ['Passed', 'Failed'];
  chartColors:Array<any> = [{
      hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
      hoverBorderWidth: 0,
      backgroundColor: ["#03d800", "#F7464A"],
      hoverBackgroundColor: ["#0ca90a","#FF5A5E"]
  }];
  chartOptions:any = {
      responsive: true
  };
  chartClicked(e: any): void { }
  chartHovered(e: any): void { }

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private classService: ClassService,
    private paperService: PaperService,
  ) {
    this.exam_id = this.route.snapshot.paramMap.get('examID');
    this.examService.getOne(this.exam_id);
    this.paperService.getAllExam(this.exam_id);
  }

  ngOnInit() {
    this.classSubscription = this.classService.classGetOne.subscribe(
      (response: any) => {
        this.classes.push(response);
      }
    );

    this.examSubscription = this.examService.examGetOne.subscribe(
      (response: any) => {
        // console.log(response);
        this.exam = response;
        let classes = response.classes;
        if (classes) {
          for (let i = 0; i < classes.length; i++) {
            this.classService.getOne(classes[i]);
          } 
        }
      }
    );

    this.paperSubscription = this.paperService.paperGetAll.subscribe(
      (response: any) => {
        this.papers = response;
        // console.log(response);
      }
    );
  }

  deletePaperConfirmation(paper_id, student_name) {
    this.selected_paper = {
      id: paper_id,
      student_name: student_name,
    };
    this.delete_paper.show();
  }

  paperDelete(paper_id) {
    this.selected_paper = {};
    this.paperService.delete(paper_id);
    this.delete_paper.hide();
  }

  ngOnDestroy() {
    this.examSubscription.unsubscribe();
    this.paperSubscription.unsubscribe();
    this.classSubscription.unsubscribe();
  }

}
