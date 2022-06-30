import { MedicalRecordService } from 'src/app/services/medical-record/medical-record.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MedicalRecordComponent } from '../medical-record/medical-record.component';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  images:string[]=[];
  constructor(
    public storageService:StorageService,
    public medicalRecordService:MedicalRecordService,
    public appointmentService:AppointmentsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { }

  async ngOnInit() {
    await this.medicalRecordService.loadMedicalRecords(this.data.email);
    await this.appointmentService.loadAppointments(this.data.type, this.data.email);
    this.data?.images.forEach(async (image:string) => {
      (await this.storageService.getImgUrl(image)).subscribe(
        (data) => {
          this.images.push(data);
        }
      );
    })
  }
  
  openMedicalRecord(medicalRecord:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = medicalRecord;
    this.dialog.open(MedicalRecordComponent, dialogConfig);
  }

  downloadUserInfo(){
    const appointments = [...this.appointmentService.appointments];
    appointments.forEach((appointment:any) => {
      appointment.startTime = new Date(appointment.startTime.seconds*1000).toLocaleString();
      appointment.endTime = new Date(appointment.endTime.seconds*1000).toLocaleString();
      appointment.creationDate = new Date(appointment.creationDate.seconds*1000).toLocaleString();
      delete appointment.body;
      delete appointment.review;
      delete appointment.isAllDay;
    })
     const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(appointments);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     XLSX.writeFile(wb, `turnos-${this.data.email}.xlsx`);
  }

}
