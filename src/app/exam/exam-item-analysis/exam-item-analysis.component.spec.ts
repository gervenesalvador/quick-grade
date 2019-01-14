import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamItemAnalysisComponent } from './exam-item-analysis.component';

describe('ExamItemAnalysisComponent', () => {
  let component: ExamItemAnalysisComponent;
  let fixture: ComponentFixture<ExamItemAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamItemAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamItemAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
