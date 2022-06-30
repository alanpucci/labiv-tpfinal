import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentsService } from '../../services/appointments/appointments.service';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-appointment-list-dialog',
  templateUrl: './appointment-list-dialog.component.html',
  styleUrls: ['./appointment-list-dialog.component.css'],
})
export class AppointmentListDialogComponent implements OnInit {
  constructor(
    public appointmentsService: AppointmentsService,
    public dialog: MatDialog,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public data:any
  ) {}

  ngOnInit(): void {
    this.appointmentsService.loadAppointments('paciente',this.data.email);
  }

  openReview(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id,
      type: this.authService.getUserData().type,
      email: this.authService.getUserData().email,
      title: 'Ver reseña',
    };
    this.dialog.open(AppointmentDialogComponent, dialogConfig);
  }
}
