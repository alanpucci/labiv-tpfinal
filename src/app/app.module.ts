import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import {MatTabsModule} from '@angular/material/tabs';
import { ToastrModule } from 'ngx-toastr';
import { RegisterPatientComponent } from './components/register-patient/register-patient.component';
import { RegisterSpecialistComponent } from './components/register-specialist/register-specialist.component';
import {MatIconModule} from '@angular/material/icon';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { ProfileComponent } from './components/profile/profile.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { RequestAppointmentComponent } from './components/request-appointment/request-appointment.component';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { DateFormatPipe } from './pipes/date-format/date-format.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import { AppointmentDialogComponent } from './components/appointment-dialog/appointment-dialog.component';
import {TextFieldModule} from '@angular/cdk/text-field';
import { ButtonTextPipe } from './pipes/button-text.pipe';
import { ButtonColorPipe } from './pipes/buttonColor/button-color.pipe';
import { WelcomeComponent } from './pages/welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterPatientComponent,
    RegisterSpecialistComponent,
    RegisterAdminComponent,
    ListUsersComponent,
    ProfileComponent,
    AppointmentsComponent,
    RequestAppointmentComponent,
    DateFormatPipe,
    AppointmentDialogComponent,
    ButtonTextPipe,
    ButtonColorPipe,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    MatSelectModule,
    ScheduleModule,
    MatDialogModule,
    TextFieldModule
  ],
  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: environment.recaptcha.siteKey,
    } as RecaptchaSettings
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
