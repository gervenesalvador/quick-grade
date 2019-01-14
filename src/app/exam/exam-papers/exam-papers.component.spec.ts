import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPapersComponent } from './exam-papers.component';

describe('ExamPapersComponent', () => {
  let component: ExamPapersComponent;
  let fixture: ComponentFixture<ExamPapersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamPapersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
