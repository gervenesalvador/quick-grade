export class Paper {
  constructor(
    public id: string,
    public examId: string,
    public exam: any,
    public examName: string,
    public imgUrl: string,
    public item: number,
    public name: string,
    public offlineImgUrl: string,
    public score: number,
    public studentAnswers: [any],
    public studentId: string,
    public student: any,
  ) {}
}