// export interface Answer {
// 	answer: string;
// 	itemNumber: number;
// }
// export interface Template {
// 	groupNumber: number;
// 	number: string;
// 	startingNumber: number;
// 	type: number;
// }
export interface Exam {
	answers: [];
	classes: [];
	classesDatas: any;
	date: string;
	items: number;
	name: string;
	offline: boolean;
	scanned: number;
	students: [];
	template: [];
}