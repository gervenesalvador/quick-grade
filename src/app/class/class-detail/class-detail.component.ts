import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClassService } from '../../services/class.service';
import { Class } from '../../models/class.model';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit, OnDestroy {
  class_id: string;
  class_data: Class;

  sClassSubscription: Subscription;

  constructor(private classService: ClassService, private route: ActivatedRoute) {
    this.class_id = this.route.snapshot.paramMap.get('classID');
    this.classService.getOne(this.class_id);
  }

  ngOnInit() {
    this.sClassSubscription = this.classService.classGetOne.subscribe(
      (response: any) => {
        console.log(response);
        this.class_data = response;
      }
    );
  }

  ngOnDestroy() {
    this.sClassSubscription.unsubscribe();
  }
}
