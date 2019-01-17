import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ExamService } from '../../services/exam.service';
import { PaperService } from '../../services/paper.service';

import { Exam } from '../../models/exam.model';
import { Paper } from '../../models/paper.model';

@Component({
  selector: 'app-exam-item-analysis',
  templateUrl: './exam-item-analysis.component.html',
  styleUrls: ['./exam-item-analysis.component.css']
})
export class ExamItemAnalysisComponent implements OnInit, OnDestroy {
  exam_id: string;
  exam: Exam;

  papers: Paper[];

  examSubscription: Subscription;
  paperSubscription: Subscription;

  analysis = [];
  total_students = 0;
  student = [];

  // chart datas
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
    private paperService: PaperService,
  ) {
    this.exam_id = this.route.snapshot.paramMap.get('examID');
    this.examService.getOne(this.exam_id);
    this.paperService.getAllExam(this.exam_id);
  }

  ngOnInit() {
    this.examSubscription = this.examService.examGetOne.subscribe(
      (exam: any) => {
        this.exam = exam;

        for (let i = 0; (exam.template.length * 10)> i; i++) {
          this.analysis.push({
            item_num: (i + 1),
            correct: 0,
            difficulty: 0,
            index: 0,
          });
        }
      }
    );

    this.paperSubscription = this.paperService.paperGetAll.subscribe(
      (papers: any) => {
        this.papers = papers;
        // console.log(papers);
        // this.total_students = papers.length;
        
        for (let p = 0; papers.length > p; p++) {
          let studentAnswers = papers[p].studentAnswers;
          
          let data = {
            student_id: papers[p].studentId,
            total_score: 0,
            question: new Array(papers[p].items)
          };
          

          for (let i = 0; papers[p].items > i; i++) {
            let sa = studentAnswers[i];
            data.question[i] = 0;
            if (sa.correct) {
              this.analysis[i].correct++;
              this.analysis[i].difficulty = ((this.analysis[i].correct / papers.length) * 100).toFixed(2);
              data.question[i] = 1;
            }
          }
          this.student.push(data);
        }

        for (let s = 0; this.student.length > s; s++) {
          let student = this.student[s];
          let total_correct = student.question.reduce((a, b) => a + b, 0);
          this.student[s].total_score = (total_correct / student.question.length) * 100;
        }
        this.student.sort((a, b) => parseFloat(b.total_score) - parseFloat(a.total_score));

        let divider = this.student.length / 2;
        for (let a = 0; this.analysis.length > a;a++) {
          let upper = 0;
          let lower = 0;
          // upper loop
          for (let u = 0; divider > u; u++) {
            upper = (+upper) + (+this.student[u].question[a]);
          }
          // lower loop
          for (let l = divider; this.student.length > l; l++) {
            lower +=this.student[l].question[a]
          }
          this.analysis[a].index = ((upper - lower) / divider).toFixed(2);
        }
        console.log(this.analysis);
      }
    );
  }

  ngOnDestroy() {
    this.examSubscription.unsubscribe();
    this.paperSubscription.unsubscribe();
  }

}
