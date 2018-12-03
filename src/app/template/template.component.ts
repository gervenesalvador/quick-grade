import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../model/user';
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import { DragulaService } from 'ng2-dragula';
// import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  @Input() exam_items: string;
  list: Array<any> = [];
  aa: any;
  image: string;
  // subs = new Subscription();

  // user_id: string;
  usersCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  constructor(private route: ActivatedRoute, private dragulaService: DragulaService) { 
    // this.user_id = this.route.snapshot.paramMap.get('id');
    dragulaService.createGroup('COPYABLE', {
      copy: (el, source) => {
        return source.id === 'type_container';
      },
      accepts: (el, target, source, sibling) => {
        return (target.id !== 'type_container') && (target.children.length == 0);
      }
    });
  }

  ngOnInit() {
    this.list.push({
      id: 20,
      keys: [
        { id: 1, top: "473px", left: "294px"},// { top: "520px", left: "557px"},
        { id: 2, top: "473px", left: "426px"}
      ]
    });

    this.list.push({
      id: 30,
      keys: [
        { id: 1, top: "623px", left: "208px" },
        { id: 2, top: "378px", left: "393px" },
        { id: 3, top: "623px", left: "393px" },
      ]
    });

    this.list.push({
      id: 50,
      keys: [
        { id: 1, top: "629px", left: "162px" },
        { id: 2, top: "383px", left: "292px" },
        { id: 3, top: "629px", left: "292px" },
        { id: 4, top: "383px", left: "424px" },
        { id: 5, top: "629px", left: "424px" },
      ]
    });

    this.aa = this.list[0].keys;
    this.image = "/assets/images/"+this.list[0].id+".jpg" ;
  }

  generate(): void {
    let draggable = document.getElementsByClassName("type_container_draggable");
    for (let i = 0; i < draggable.length; i++) {
      let left = draggable[i]['style'].left;
      draggable[i]['style'].left = (+(left.replace("px", "")) + 7).toString() + "px";
    }
    
    var data = document.getElementById('paper'); 
    html2canvas(data).then(canvas => { 
      var imgWidth = 208; 
      var pageHeight = 295; 
      var imgHeight = canvas.height * imgWidth / canvas.width; 
      var heightLeft = imgHeight; 

      const contentDataURL = canvas.toDataURL('image/png') 
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF 
      var position = 0; 
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight) 

      let draggable = document.getElementsByClassName("type_container_draggable");
      for (let i = 0; i < draggable.length; i++) {
        let left = draggable[i]['style'].left;
        draggable[i]['style'].left = (+(left.replace("px", "")) - 7).toString() + "px";
      }
      pdf.save('template.pdf'); // Generated PDF  
    }); 
  }

  change_exam(item) {
    // console.log(this.list[item]);
    this.aa = this.list[item].keys;
    this.image = "/assets/images/"+this.list[item].id+".jpg" ;
  }

  deleteImage(id) {
    let container = document.getElementById('item-'+id);
    container.innerHTML = '';
    // console.log(id);
  }
}
