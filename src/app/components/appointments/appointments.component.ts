import { AppointmentsService } from './../../services/appointments/appointments.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { User } from 'src/app/models/user/user';
import { ButtonTextPipe } from '../../pipes/button-text.pipe';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  providers:[ButtonTextPipe]
})
export class AppointmentsComponent implements OnInit {

  filterText:string="";
  loggedUser:User;
  constructor(public appointmentsService:AppointmentsService, private authService:AuthService, public dialog: MatDialog, public buttonText:ButtonTextPipe) {
    this.loggedUser=this.authService.getUserData();
  }

  ngOnInit(): void {
    const user = this.authService.getUserData();
    this.appointmentsService.loadAppointments(user.type, user.email);
  }

  openDialog(open:boolean, id:string, status:string, title:string){
    if(open){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        id,
        type:this.loggedUser.type,
        email:this.loggedUser.email,
        title,
        status
    };
    this.dialog.open(AppointmentDialogComponent, dialogConfig);
    }
  }

  filter(text:string){
    this.appointmentsService.filterAppointments(text, this.authService.getUserData().type);
  }

  setStatus(status:string, id:string){
    if(this.loggedUser.type==='paciente'){
      switch(status){
        case "Pendiente":
          this.openDialog(true,id,"Cancelado", "¿Por qué querés cancelar el turno?");
        break;
        case "Cancelado":
          this.openDialog(true,id,"", "Ver reseña");
        break;
        case "Atendido":
          this.openDialog(true,id,"Terminado", "¿Qué te pareció la atención del especialista?");
        break;
        case "Terminado":
          this.openDialog(true,id,"", "Ver reseña");
        break;
      }
    }
  }

}