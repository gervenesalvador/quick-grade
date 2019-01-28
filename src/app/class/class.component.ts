import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { FormGroup, FormControl } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

import { ClassService } from '../services/class.service';

import { Class } from '../models/class.model';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit, OnDestroy  {
  @ViewChild('create_class') createClass: ModalDirective;
  @ViewChild('delete_class') delete_class: ModalDirective;
  
  classForm = new FormGroup({
    class_id: new FormControl(''),
    name: new FormControl(''),
  });

  deletingClassName: string;
  create_modal_title: string;
  selected_class: string;

  classSubscription: Subscription;
  // sClassSubscription: Subscription;
  classes: Class[];
  sClass: Class;

  constructor(
    // private afs: AngularFirestore,
    // private route: ActivatedRoute,
    private classService: ClassService,
    // private authService: AuthService,
  ) {
    this.classService.getAll();
    // this.userAuth = this.authService.getUser();
    this.deletingClassName = '';
    this.create_modal_title = 'Create Class';
  }

  ngOnInit() { 
    this.classSubscription = this.classService.classGetAll.subscribe(
      (class_data: any) => {
        this.classes = class_data;
      }
    );
  }

  classFormOnSubmit(): void {
    if (this.classForm.value.class_id) {
      this.classService.update(this.classForm.value.class_id, this.classForm.value);
    } else {
      this.classService.insert(this.classForm.value);
    }
    this.create_modal_title = "Create Class";
    this.createClass.hide();
    this.classForm.reset();
  }

  showClassFormModal(class_id = null, class_name = null): void {
    if (class_id) {
      this.create_modal_title = 'Update '+class_name+' Class';
      this.classForm.setValue({class_id: class_id, name: class_name});
    } else {
      this.classForm.reset();
    }
    this.createClass.show();
  }

  deleteConfirmation(class_id, class_name): void {
    this.delete_class.show();
    this.selected_class = class_id;
    this.deletingClassName = class_name;
  }

  deleteClass(): void {
    this.classService.delete(this.selected_class);
    this.deletingClassName = '';
    this.delete_class.hide();
  }

  hideClassFormModal(): void {
    this.create_modal_title = "Create Class";
    this.createClass.hide();
    this.classForm.reset();
  }

  ngOnDestroy() {
    this.classSubscription.unsubscribe();
    // this.sClassSubscription.unsubscribe();
  }

  // uploadFile(event) {

  //   let file = event.target.files[0],
  //       ext = file.type.split('/')[1],
  //       filePath = `profile/${new Date().getTime()}.${ext}`,
  //       fileRef = this.storage.ref(filePath),
  //       task = this.storage.upload(filePath, file);

  //   task.snapshotChanges().pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe(
  //           (res) => {
  //             console.log(res);
  //           }
  //         );
  //       })
  //   ).subscribe(
  //     // (res: any) => {
  //     //   console.log(res);
  //     //   console.log(this.downloadURL);
  //     // }
  //   );
  // }
}
