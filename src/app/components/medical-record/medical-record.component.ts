import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MedicalRecordService } from 'src/app/services/medical-record/medical-record.service';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css'],
})
export class MedicalRecordComponent implements OnInit {
  medicalRecordForm = new FormGroup({
    height: new FormControl('', [
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      Validators.max(230),
      Validators.min(100)
    ]),
    weight: new FormControl('', [
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      Validators.max(250),
      Validators.min(30)
    ]),
    temperature: new FormControl('', [
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      Validators.max(45),
      Validators.min(30)
    ]),
    pressure: new FormControl('', [
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      Validators.max(240),
      Validators.min(60)
    ]),

    firstKey: new FormControl(''),
    firstValue: new FormControl(''),
    secondKey: new FormControl(''),
    secondValue: new FormControl(''),
    thirdKey: new FormControl(''),
    thirdValue: new FormControl(''),
    fourthKey: new FormControl(''),
    fourthValue: new FormControl(''),
    fifthKey: new FormControl(''),
    fifthValue: new FormControl(''),
    sixthKey: new FormControl(''),
    sixthValue: new FormControl(''),
  });
  constructor(
    private modal: MatDialog,
    private toastr: ToastrService,
    private medicalRecordService: MedicalRecordService,
    private appointmentService:AppointmentsService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {}

  async registerRecord() {
    if (this.medicalRecordForm.valid) {
      const body = {
        [new Date().toISOString()]: {
          ...this.medicalRecordForm.value,
          patientName: this.data.patientName,
          patientEmail: this.data.patientEmail,
          specialistEmail: this.data.specialistEmail,
          specialistName: this.data.specialistName,
        },
      };
      this.modal.closeAll();
      this.medicalRecordService.registerSchedule(this.data.patientEmail, body);
      this.appointmentService.updateAppointment(this.data.id,'especialista',this.data.specialistEmail,{status:'Atendido', body})
    } else {
      this.toastr.error('Todos los campos son requeridos');
    }
  }
}
