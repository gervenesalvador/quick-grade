export class Student {
  constructor(
    public id: string,
    public classes: [string],
    public customID: string,
    public exams: [string],
    public firstName: string,
    public lastName: string,
  ) {}
}