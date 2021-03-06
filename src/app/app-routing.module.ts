import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClassComponent } from './class/class.component';
import { ClassDetailComponent } from './class/class-detail/class-detail.component';
import { StudentComponent } from './student/student.component';
import { StudentDetailComponent } from './student/student-detail/student-detail.component';
import { ExamComponent } from './exam/exam.component';
import { ExamDetailComponent } from './exam/exam-detail/exam-detail.component';
import { ExamEditComponent } from './exam/exam-edit/exam-edit.component';
import { ExamPapersComponent } from './exam/exam-papers/exam-papers.component';
import { ExamItemAnalysisComponent } from './exam/exam-item-analysis/exam-item-analysis.component';
import { PaperComponent } from './paper/paper.component';
import { PaperDetailComponent } from './paper/paper-detail/paper-detail.component';
import { TemplateComponent } from './template/template.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'classes', canActivate: [AuthGuardService], component: ClassComponent },
  { path: 'classes/:classID', canActivate: [AuthGuardService], component: ClassDetailComponent },
  { path: 'students', canActivate: [AuthGuardService], component: StudentComponent },
  { path: 'students/:studentID', canActivate: [AuthGuardService], component: StudentDetailComponent },
  { path: 'exams', canActivate: [AuthGuardService], component: ExamComponent },
  { path: 'exams/:examID', canActivate: [AuthGuardService], component: ExamDetailComponent },
  { path: 'exams/:examID/edit', canActivate: [AuthGuardService], component: ExamEditComponent },
  { path: 'exams/:examID/papers', canActivate: [AuthGuardService], component: ExamPapersComponent },
  { path: 'exams/:examID/item-analysis', canActivate: [AuthGuardService], component: ExamItemAnalysisComponent },
  { path: 'papers/:paperID', canActivate: [AuthGuardService], component: PaperDetailComponent },
  { path: 'template', canActivate: [AuthGuardService], component: TemplateComponent },

  // { path: 'users', component: UserComponent },
  // { path: 'users/:id/classes', component: ClassComponent },
  // { path: 'users/:id/classes/:classID', component: ClassDetailComponent },
  // { path: 'users/:id/students', component: StudentComponent },
  // { path: 'users/:id/students/:studentID', component: StudentDetailComponent },
  // { path: 'users/:id/exams', component: ExamComponent },
  // { path: 'users/:id/exams/:examID', component: ExamDetailComponent },
  // { path: 'users/:id/papers', component: PaperComponent},
  // { path: 'users/:id/papers/:paperID', component: PaperDetailComponent },
  // { path: 'users/:id/template', component: TemplateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
