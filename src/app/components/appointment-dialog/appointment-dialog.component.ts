import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonTextPipe } from 'src/app/pipes/button-text.pipe';
import { AppointmentsService } from '../../services/appointments/appointments.service';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.css'],
})
export class AppointmentDialogComponent implements OnInit {
  comment: string = '';
  title: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: string;
      title:string;
      email: string;
      id: string;
      status: string;
    },
    public appointmentsService: AppointmentsService,
  ) {}

  ngOnInit(): void {
    // this.setTitle();
    if(this.data.title==="Ver reseña"){
      this.appointmentsService.getAppointment(this.data.id);
    }
  }

  // setTitle(){
  //   switch(this.data.status){
  //     case "Ver reseña":
  //       this.title = "Revisar reseña";
  //     break;
  //     case "Cancelar turno":
  //       this.title = "¿Por qué quieres cancelar el turno?"
  //     break;
  //     case "Calificar atención":
  //       this.title = "¿Por qué quieres cancelar el turno?"
  //     break;
  //   }
  // }

  registerComment() {
    this.appointmentsService.updateAppointment(
      this.data.id,
      this.data.type,
      this.data.email,
      { status: this.data.status, comment: this.comment }
    );
  }
}
