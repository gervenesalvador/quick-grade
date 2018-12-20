export class Exam {
  constructor(
  	public id: string,
  	public date: any,
    public items: number,
    public name: string,
    public offline: boolean,
    public scanned: number,
    public classes: Array<any> = [],
  ) {}
}