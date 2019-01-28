import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { DragulaModule } from 'ng2-dragula';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';

import { LoginComponent } from './login/login.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClassComponent,
    StudentComponent,
    ExamComponent,
    ClassDetailComponent,
    NavigationBarComponent,
    StudentDetailComponent,
    ExamDetailComponent,
    PaperComponent,
    PaperDetailComponent,
    TemplateComponent,
    ExamEditComponent,
    ExamPapersComponent,
    ExamItemAnalysisComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AppRoutingModule,
    DragulaModule.forRoot(),
  ],
  providers: [AuthService, AuthGuardService, DatePipe],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
