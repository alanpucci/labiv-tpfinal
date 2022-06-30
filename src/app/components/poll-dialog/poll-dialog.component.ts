import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-poll-dialog',
  templateUrl: './poll-dialog.component.html',
  styleUrls: ['./poll-dialog.component.css']
})
export class PollDialogComponent implements OnInit {

  pollForm = new FormGroup({
    score: new FormControl('', Validators.required),
    return: new FormControl('',Validators.required),
    clinicComments: new FormControl('',Validators.required),
  })

  constructor(
    private modal: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public appointmentsService:AppointmentsService
  ) { }

  ngOnInit(): void {
  }

  registerPoll(){
    if (this.pollForm.valid) {
      this.modal.closeAll();
      this.appointmentsService.updateAppointment(this.data.id,'paciente',this.data.patientEmail,{status:'Completado',poll:{...this.pollForm.value}})
    } else {
      this.toastr.error('Todos los campos son requeridos');
    }
  }

}
