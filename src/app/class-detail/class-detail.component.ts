import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; //AngularFirestoreCollection
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { Class } from '../model/class';
import { Exam } from '../model/exam';
import { Student } from '../model/student';
import { ModalDirective } from 'angular-bootstrap-md';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-class-detail',
	templateUrl: './class-detail.component.html',
	styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit {
	@ViewChild('modal_remove_exam') modal_remove_exam: ModalDirective;
	@ViewChild('modal_remove_student') modal_remove_student: ModalDirective;
	// user_id: string;
	class_id: string;
	// usersCollection: AngularFirestoreCollection<User>;
	userDoc: AngularFirestoreDocument<User>;
	user: Observable<User>;
	userAuth: Object;
	
	classDoc: AngularFirestoreDocument<Class>;
	class: Observable<Class>;
	classContainer: any;

	selectedStudentDoc: AngularFirestoreDocument<Student>;
	selectedStudent: Observable<Student>;

	selectedExamDoc: AngularFirestoreDocument<Exam>;
	selectedExam: Observable<Exam>;

	constructor(
		private afs: AngularFirestore,
		private route: ActivatedRoute,
		private authService: AuthService,
	) {
		this.userAuth = this.authService.getUser();
		// this.user_id = this.route.snapshot.paramMap.get('id');
		this.class_id = this.route.snapshot.paramMap.get('classID');
	}

	ngOnInit() {
		// this.usersCollection = this.afs.collection<User>('Users');
		this.userDoc = this.afs.collection<User>('Users').doc(this.userAuth['id']);
		this.user = this.userDoc.valueChanges();

		this.classDoc = this.userDoc.collection('Class').doc(this.class_id);

		this.class = this.classDoc.snapshotChanges().map(classDoc => {
			let data = classDoc.payload.data();
			let temp_exams = [];
			if (data.exams) {
				data.exams.forEach(exam => {
					temp_exams.push(this.userDoc.collection('Exam').doc(exam)//.valueChanges()
						.snapshotChanges().map(arr => {
							if (arr.payload.exists) {
								let exam_data = arr.payload.data();
								let date = new Date(exam_data['date'].toDate())
								exam_data['date'] = date.toDateString()+" "+date.getHours()+":"+date.getMinutes(); //(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":";
								return {id: arr.payload.id, ...exam_data };
							}
						}));
				});
			}
			data.examsDatas = temp_exams;

			let temp_students = [];
			if (data.students) {
				data.students.forEach(student => {
					temp_students.push(this.userDoc.collection('Student').doc(student)//.valueChanges()
						.snapshotChanges().map(arr => {
							if (arr.payload.exists) {
								// let student_data = arr.payload.data();
								return {id: arr.payload.id, ...arr.payload.data() };
							}
						})
					);
				});
			}
			data.studentsDatas = temp_students;

			let papersDatas = [];
			if (data.students && data.exams) {
				data.students.forEach(student_id => {
					data.exams.forEach(exam_id => {
						papersDatas.push(this.userDoc.collection('Paper', ref => 
								ref.where('studentId', "==", student_id)
								.where('examId', "==", exam_id)
							).snapshotChanges().map(paper => {
								// if (paper[0]) {
									return paper.map(paper_data => {
										// if (paper_data.payload.doc.exists) {
											return { id: paper_data.payload.doc.id, ...paper_data.payload.doc.data() };
										// }
									});
									
								// }
							})
						);
					});
				});
			}
			data.papersDatas = papersDatas;

			return { id: classDoc.payload.id, ...data };
		});

		this.class.subscribe(class_data => {
			let examsTemp = [];
			for (var e = 0; e < class_data.examsDatas.length; e++) {
				class_data.examsDatas[e].subscribe(exam_data => {
					examsTemp.push(exam_data);
				});	
			}
			class_data.examsDatas = examsTemp;

			let studentTemp = [];
			for (var s = 0; s < class_data.studentsDatas.length; s++) {
				class_data.studentsDatas[s].subscribe(student_data => {
					studentTemp.push(student_data);
				});
			}
			class_data.studentsDatas = studentTemp;

			let paperTemp = [];
			for (var p = 0; p < class_data.papersDatas.length; p++) {
				class_data.papersDatas[p].subscribe(paper_data => {
					if (paper_data[0]) {
						paperTemp.push(paper_data[0]);
					}
				});
			}
			class_data.papersDatas = paperTemp;
			this.classContainer = class_data;
		});
	}

	showRemoveStudentConfirmation(student_id): void {
		this.selectedStudentDoc = this.userDoc.collection('Student').doc(student_id);
		this.selectedStudent = this.selectedStudentDoc
			.snapshotChanges().map(student => {
				if (student.payload.exists) {
					let student_data = student.payload.data();
					return {id: student.payload.id, ...student_data};
				}
			});
		this.modal_remove_student.show();
	}

	removeStudent(student_id): void {
		this.classDoc.valueChanges().subscribe(classd => {
			classd.studentsDatas = classd.students.filter(data => {
				return data != student_id;
			});
			this.classDoc.update(classd);
		});
		this.modal_remove_student.hide();
	}

	showRemoveExamConfirmation(exam_id): void {
		this.selectedExamDoc = this.userDoc.collection('Exam').doc(exam_id);
		this.selectedExam = this.selectedExamDoc
			.snapshotChanges().map(exam => {
				if (exam.payload.exists) {
					let exam_data = exam.payload.data();
					return {id: exam.payload.id, ...exam_data};
				}
			});
		this.modal_remove_exam.show();
	}

	removeExam(exam_id): void {
		this.classDoc.valueChanges().subscribe(classd => {
			classd.examsDatas = classd.exams.filter(data => {
				return data != exam_id;
			});
			this.classDoc.update(classd);
		});
		this.selectedExamDoc = null;
		this.selectedExam = null;
		this.modal_remove_exam.hide();
	}
	export_all_student(): void {
		let datas = this.classContainer;
		let students = [];
		let csv = [];
		console.log(datas);
		csv.push({
			student_id: "Student ID",
			student_name: "Student Name",
			stubject_name: "Subject Name",
			score: "Score",
			items: "Items"
		})
		for (let s = 0; s < datas.studentsDatas.length; s++) {
			let student = datas.studentsDatas[s];
			// console.log(student);
			csv.push({
				student_id: student.customID,
				student_name: student.firstName+" "+student.lastName,
				stubject_name: "",
				score: "",
				items: ""
			});

			for (let e = 0; e <= datas.examsDatas.length; e++) {
				if (datas.examsDatas[e]) {
					let ishave = 0;
					for (let p = 0; p < datas.papersDatas.length; p++) {
						if (datas.papersDatas[p]) {
							if (datas.papersDatas[p].examId == datas.examsDatas[e].id
								&& datas.papersDatas[p].studentId ==  student.id) {

								csv.push({
									student_id: "",
									student_name: "",
									stubject_name: datas.papersDatas[p].name,
									score: datas.papersDatas[p].score,
									items: datas.papersDatas[p].items
								});
								ishave = 1;
								console.log(datas.papersDatas[p]);
							}
						}
					}
					if (ishave == 0) {
						csv.push({
							student_id: "",
							student_name: "",
							stubject_name: datas.examsDatas[e].name,
							score: 0,
							items: 0
						});
					}
				}
			}
		}

		console.log(csv);
		new Angular5Csv(csv, datas.name);

	}
}
