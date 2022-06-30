import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UsersService } from '../../services/users/users.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MedicalRecordComponent } from '../medical-record/medical-record.component';
import { User } from '../../models/user/user';
import { AppointmentListDialogComponent } from '../appointment-list-dialog/appointment-list-dialog.component';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.css'],
})
export class ListPatientsComponent implements OnInit {
  images: any[] = [];
  users: any[] = [];
  constructor(
    public appointmentService: AppointmentsService,
    public authService: AuthService,
    public usersService: UsersService,
    private storageService: StorageService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.appointmentService.loadAppointments(
      'especialista',
      this.authService.getUserData().email
    );
    setTimeout(async () => {
      const emails: string[] = this.appointmentService.appointments.map(
        (appointment: any) => appointment.patientEmail
      );
      this.users = emails.filter(
        (item, index) => emails.indexOf(item) === index
      );
      await this.usersService.getPatientsByEmail(this.users);
    }, 2000);
    setTimeout(async () => {
      this.usersService.patients.forEach(async (user) => {
        (await this.storageService.getImgUrl(user.images[0])).subscribe(
          (data: string) => {
            this.images = { ...this.images, [user.email]: data };
          }
        );
      });
    }, 3000);
  }

  openDialog(user:User) {
    const dialogConfig = new MatDialogConfig();
    console.log(user)
    dialogConfig.data = user;
    this.dialog.open(AppointmentListDialogComponent, dialogConfig);
  }
}
