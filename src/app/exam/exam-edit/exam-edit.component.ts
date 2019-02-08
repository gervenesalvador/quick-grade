import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ModalDirective } from 'angular-bootstrap-md';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

import { ExamService } from '../../services/exam.service';

import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css']
})
export class ExamEditComponent implements OnInit, OnDestroy {
  exam_id: string;
  examSubscription: Subscription;
  exam: Exam;

  item_count = 0;

  type = [];

  examKeysForm = new FormGroup({
    item_num: new FormControl('', Validators.required),
    type: new FormArray([], Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private formBuilder: FormBuilder,
  ) {
    this.exam_id = this.route.snapshot.paramMap.get('examID');
    this.examService.getOne(this.exam_id);
  }

  ngOnInit() {
    this.examSubscription = this.examService.examGetOne.subscribe(
      (response: any) => {
        this.exam = response;
        // console.log(typeof response.items);
        // console.log(response);
        this.setItemNumber(response.items);
      }
    );

    
  }

  get addForm() {
    return this.examKeysForm.get('type') as FormArray;
  }

  setItemNumber(itemNum) {
    this.item_count = itemNum / 10;
    this.type = [];
    this.examKeysForm.setControl('type', new FormArray([]));

    for (let i = 0; i < this.item_count; i++) {
      this.addForm.push(this.formBuilder.control(''));
      this.type.push('Bubble');
    }
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  changeType(i, type) {
    this.type[i] = type;
  }
  examKeysFormOnSubmit() {
    let request = this.examKeysForm.value;
    let template = [];

    this.exam.template = [];
    this.exam.items = request.item_num;

    for (let i  = 0; i < request.type.length; i++) {
      template.push({
        groupNumber: i,
        name: this.type[i] + " " + i + "1 - " + ( i + 1) + "0", 
        startingNumber: parseInt(i+"1"),
        type: (request.type[i] == 'text') ? 2 : 1,
      });
    }
    this.exam.template = template;

    this.examService.update(this.exam_id, this.exam);
    this.examKeysForm.reset();

    this.router.navigate(['/exams/'+this.exam_id]);
  }

  ngOnDestroy() {
    this.examSubscription.unsubscribe();
  }
  
}
