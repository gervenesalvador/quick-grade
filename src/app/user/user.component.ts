import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../model/user';
import { Class } from '../model/class';
import { Router } from '@angular/router'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  @ViewChild('alert') alert: ElementRef;
  alertMessage: Object;

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.alertMessage = JSON.parse(sessionStorage.getItem('alertMessage'));
  }

  ngOnInit() {
    this.usersCollection = this.afs.collection<User>('Users');
    this.users = this.usersCollection.snapshotChanges()
      .map((arr) => {
        // console.log(arr);
        return arr.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
  }

  closeAlert(): void {
    sessionStorage.removeItem('alertMessage');
    this.alert.nativeElement.classList.remove('show');
  }
}
