import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { MedicalRecordService } from 'src/app/services/medical-record/medical-record.service';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css'],
})
export class MedicalRecordComponent implements OnInit {

  @ViewChild('invoice') invoiceElement!: ElementRef;
  medicalRecordForm = new FormGroup({
    height: new FormControl({value:this.data.value?.height, disabled:!!this.data.value?.height}, [
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      Validators.max(230),
      Validators.min(100),
    ]),
    weight: new FormControl({value:this.data.value?.weight||'', disabled:!!this.data.value?.weight}, [
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      Validators.max(250),
      Validators.min(30)
    ]),
    temperature: new FormControl({value:this.data.value?.temperature, disabled:!!this.data.value?.temperature}, [
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      Validators.max(45),
      Validators.min(30)
    ]),
    pressure: new FormControl({value:this.data.value?.pressure, disabled:!!this.data.value?.pressure}, [
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      Validators.max(240),
      Validators.min(60)
    ]),

    firstKey: new FormControl({value:this.data.value?.firstKey||'', disabled:!!this.data.value?.pressure}),
    firstValue: new FormControl({value:this.data.value?.firstValue||'', disabled:!!this.data.value?.pressure}),
    secondKey: new FormControl({value:this.data.value?.secondKey||'', disabled:!!this.data.value?.pressure}),
    secondValue: new FormControl({value:this.data.value?.secondValue||'', disabled:!!this.data.value?.pressure}),
    thirdKey: new FormControl({value:this.data.value?.thirdKey||'', disabled:!!this.data.value?.pressure}),
    thirdValue: new FormControl({value:this.data.value?.thirdValue||'', disabled:!!this.data.value?.pressure}),
    fourthKey: new FormControl({value:this.data.value?.fourthKey||'', disabled:!!this.data.value?.pressure}),
    fourthValue: new FormControl({value:this.data.value?.fourthValue||'', disabled:!!this.data.value?.pressure}),
    fifthKey: new FormControl({value:this.data.value?.fifthKey||'', disabled:!!this.data.value?.pressure}),
    fifthValue: new FormControl({value:this.data.value?.fifthValue||'', disabled:!!this.data.value?.pressure}),
    sixthKey: new FormControl({value:this.data.value?.sixthKey||'', disabled:!!this.data.value?.pressure}),
    sixthValue: new FormControl({value:this.data.value?.sixthValue||'', disabled:!!this.data.value?.pressure}),
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
      console.log({...this.medicalRecordForm.value})
      const body = {
        [new Date().toISOString()]: {
          ...this.medicalRecordForm.value,
          patientName: this.data.patientName,
          patientEmail: this.data.patientEmail,
          specialistEmail: this.data.specialistEmail,
          specialistName: this.data.specialistName,
          creationDate:new Date()
        },
      };
      this.modal.closeAll();
      this.medicalRecordService.registerMedicalRecord(this.data.patientEmail, body);
      this.appointmentService.updateAppointment(this.data.id,'especialista',this.data.specialistEmail,{status:'Atendido', body})
    } else {
      this.toastr.error('Todos los campos son requeridos');
    }
  }

  download(){
    let PDF = new jsPDF('p', 'mm', 'a4',);
    PDF.addImage('../../../assets/logo.png', 'PNG', 10, 10,50,50);
    const date = new Date(this.data.key).toLocaleString();
    PDF.text(`Clínica MediPlus`, 70,20)
    PDF.text(`Historia clínica de ${this.data.value.patientName}`, 70,30)
    PDF.text(`Atendido por ${this.data.value.specialistName}`, 70,40)
    PDF.text(`Fecha: ${date}`,70,50)
    PDF.text(`Altura: ${this.data.value.height}cm`,10,70)
    PDF.text(`Peso: ${this.data.value.weight}kgs`,10,80)
    PDF.text(`Temperatura: ${this.data.value.temperature}ºC`,10,90)
    PDF.text(`Presión: ${this.data.value.pressure} (media)`,10,100)
    this.data.value.firstKey && PDF.text(`${this.data.value.firstKey}: ${this.data.value.firstKey}`,10,110)
    this.data.value.secondKey && PDF.text(`${this.data.value.secondKey}: ${this.data.value.secondKey}`,10,120)
    this.data.value.thirdKey && PDF.text(`${this.data.value.thirdKey}: ${this.data.value.thirdKey}`,10,130)
    this.data.value.fourthKey && PDF.text(`${this.data.value.fourthKey}: ${this.data.value.fourthKey}`,10,140)
    this.data.value.fifthKey && PDF.text(`${this.data.value.fifthKey}: ${this.data.value.fifthKey}`,10,150)
    this.data.value.sixthKey && PDF.text(`${this.data.value.sixthKey}: ${this.data.value.sixthKey}`,10,160)
    PDF.save('historia-clínica.pdf');
  }
}
