import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  medicalRecords:any;
  constructor(private spinner:NgxSpinnerService, private toastr:ToastrService, private afs:AngularFirestore) { }

  async registerMedicalRecord(email:string,medicalRecord: any) {
    try {
      this.spinner.show();
      await this.afs.collection('medicalRecords').doc(email).update({...medicalRecord})
      setTimeout(() => {
        this.toastr.success('Historia clínica registrada exitosamente');
      }, 1000);
    } catch (error: any) {
      if(error.code === 'not-found'){
        await this.afs.collection('medicalRecords').doc(email).set({...medicalRecord})
        setTimeout(() => {
          this.toastr.success('Historia clínica registrada exitosamente');
        }, 1000);
        return
      }
      this.toastr.error('Ocurrió un error al registar la historia clínica');
      console.log(error);
    } finally {
      this.spinner.hide();
    }
  }

  async loadMedicalRecords(email: string) {
    try {
      this.spinner.show();
      await this.afs.collection<any>('medicalRecords').doc(email).get().subscribe(data => {
        this.medicalRecords = data.data();
        console.log(data.data());
      });
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    } catch (error:any) {
      console.log(error);
      this.spinner.hide();
      return;
    }
  }

}
