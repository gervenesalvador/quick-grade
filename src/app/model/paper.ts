// export interface StudentAnswer {
// 	answer: string;
// 	correct: boolean;
// 	itemNumber: number;
// }
export interface Paper {
	examId: string;
	exam: any;
	examName: string;
	imgUrl: string;
	item: number;
	name: string;
	offlineImgUrl: string;
	score: number;
	studentAnswers: [any];
	studentId: string;
	student: any;
}