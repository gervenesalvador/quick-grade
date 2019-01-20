import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { ModalDirective } from 'angular-bootstrap-md';

import { ExamService } from '../services/exam.service';
import { ClassService } from '../services/class.service';

import { Exam } from '../models/exam.model';
import { Class } from '../models/class.model';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, OnDestroy {
  @ViewChild('create_exam') create_exam : ModalDirective;
  @ViewChild('create_class') create_class: ModalDirective;
  @ViewChild('delete_exam') delete_exam: ModalDirective;

  exams: Exam[];
  class: Class[];
  exam: Exam;

  examsSubscription: Subscription;
  classSubscription: Subscription;
  // examSubscription: Subscription;

  createExamModalTitle = 'Add Exam';
  examForm = this.formBuilder.group({
    exam_id: [''],
    name: [''],
    date: [''],
    classes: new FormArray([]), // this.buildClass
  });
  examFormClassList: Array<any> = [];
  selectedExam: any = {};

  classForm = this.formBuilder.group({
    name: [''],
  });

  constructor(
    private examService: ExamService, 
    private classService: ClassService, 
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.examService.getAll();
    this.classService.getAll();
  }

  ngOnInit() {
    this.examsSubscription = this.examService.examGetAll.subscribe(
      (response: any) => {
        this.exams = response;
      }
    );

    this.classSubscription = this.classService.classGetAll.subscribe(
      (response: any) => {
        // console.log(response);
        for (let i = 0; i < response.length; i++) {
          this.classesExamForm.push(this.formBuilder.control('')); // add form array
          this.examFormClassList.push({ class_id: response[i].id, html_id: 'user-'+i, name: response[i].name });
        }
        this.class = response;
      }
    );
  }

  get classesExamForm() {
    return this.examForm.get('classes') as FormArray;
  }

  examEdit(exam) {
    // console.log(exam);
    this.examForm.reset();
    let class_selected = [];
    for (let i = 0; i < this.examFormClassList.length; i++) {
      class_selected.push(false);
    }

    if (exam.classes) {
      for (let i = 0; i < this.examFormClassList.length; i++) {
        if (exam.classes.includes(this.examFormClassList[i].class_id)) {
          class_selected[i] = true;
        } 
      }
    }

    this.examForm.setValue({
      exam_id: exam.id,
      name: exam.name,
      date: this.datePipe.transform(exam.date.toDate(), 'yyyy-MM-dd hh:mm:ss'),//exam.date,
      classes: class_selected,
    });

    this.selectedExam = exam;
    this.createExamModalTitle = "Edit "+ exam.name +" Exam";
    this.create_exam.show();
  }

  examFormOnSubmit() {
    let request = this.examForm.value;
    let exam_class = request.classes.map((arr, key) => {
      if (arr) { 
        return this.examFormClassList[key].class_id; 
      }
      return false;
    });
    exam_class = exam_class.filter(Boolean);
    // console.log(exam_class instanceof Array );
    // console.log(exam_class);
    if (request.exam_id) {
      console.log(this.selectedExam);
      this.selectedExam.classes = exam_class;
      this.selectedExam.date = new Date(request.date);
      this.selectedExam.name = request.name

      // this.examService.update(request.exam_id, exam_data);
      this.examService.update(request.exam_id, this.selectedExam);
      this.examForm.reset();
      this.create_exam.hide();
      this.selectedExam = {};
      return true;
    }

    this.examService.insert({
      answers: [],
      classes: exam_class,
      date: new Date(this.examForm.value.date),
      items: 0,
      name: this.examForm.value.name,
      offline: false, scanned: 0, students: [], template: []
    });
    this.examForm.reset();
    this.create_exam.hide();
  }
  openExamModal(): void {
    this.createExamModalTitle = "Add Exam";
    this.examForm.reset();
    this.classForm.reset()
    this.create_exam.show();
  }
  closeExamModal(): void {
    this.createExamModalTitle = "Add Exam";
    this.examForm.reset();
    this.classForm.reset()
    this.create_exam.hide();
  }
  examDeleteConfirmation(exam_id, exam_name) {
    this.selectedExam = {
      id: exam_id,
      name: exam_name,
    };
    this.delete_exam.show();
  }
  examDelete(exam_id) {
    this.examService.delete(exam_id);
    this.delete_exam.hide();
  }

  classFormOnSubmit() {
    let class_data = this.classForm.value;
    this.classService.insert(class_data);
    this.create_class.hide();
    this.classForm.reset()
  }

  ngOnDestroy() {
    this.classSubscription.unsubscribe();
    this.examsSubscription.unsubscribe()
  }

}
