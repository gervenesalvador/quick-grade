// export interface Section {
// 	name: string;
// 	exams: [string];
// }
// import { Observable } from 'rxjs/Observable';

export interface Class {
	name: string;
	exams: [string];
	students: [string];
	examsDatas: any;
	papersDatas: any;
	studentsDatas: any;
}