import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { Class } from '../model/class';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
  // user: Object;
  @ViewChild('create_class') createClass: ModalDirective;
  @ViewChild('delete_class') delete_class: ModalDirective;
  // user_id: string;
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  userAuth: Object;
  classCollection: AngularFirestoreCollection<Class>;
  classes: Observable<Class[]>;
  
  classForm = new FormGroup({
    class_id: new FormControl(''),
    name: new FormControl(''),
  });

  currentClassDoc: AngularFirestoreDocument<Class>;
  deletingClassName: string;

  create_modal_title: string;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.userAuth = this.authService.getUser();
    // this.user_id = this.route.snapshot.paramMap.get('id');
    this.deletingClassName = '';
    this.create_modal_title = 'Create Class';
  }

  ngOnInit() { 
    this.userDoc = this.afs.collection<User>('Users').doc(this.userAuth['id']);
    this.user = this.userDoc.valueChanges();
    this.classCollection = this.userDoc.collection('Class');
    this.classes = this.classCollection.snapshotChanges()
      .map((arr) => {
        return arr.map(a => {
          let data = a.payload.doc.data() as Class;
          return { id: a.payload.doc.id, ...data };
        })
      });
  }

  classFormOnSubmit(): void {
    if (this.classForm.value.class_id) {
      let classDoc = this.classCollection.doc(this.classForm.value.class_id);
      classDoc.update(this.classForm.value);
    } else {
      this.classCollection.add(this.classForm.value);
    }
    this.create_modal_title = "Create Class";
    this.createClass.hide();
    this.classForm.reset();
  }

  showClassFormModal(class_id = null, class_name = null): void {
    if (class_id) {
      this.create_modal_title = 'Update '+class_name+' Class';
      this.classForm.setValue({class_id: class_id, name: class_name});
    }
    this.createClass.show();
  }

  deleteConfirmation(class_id, class_name): void {
    this.delete_class.show();
    this.currentClassDoc = this.classCollection.doc(class_id);
    this.deletingClassName = class_name;
  }

  deleteClass(): void {
    this.currentClassDoc.delete();
    this.deletingClassName = '';
    this.delete_class.hide();
  }

  hideClassFormModal(): void {
    this.create_modal_title = "Create Class";
    this.createClass.hide();
    this.classForm.reset();
  }





  // closeClassFormModal(): void {
  //   this.create_modal_title = "Create Class";
  //   this.createClass.hide();
  // }
}
