import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpecialistHoursService {

  schedule:any;
  constructor(private spinner:NgxSpinnerService, private toastr:ToastrService, private afs:AngularFirestore) { }

  async registerSchedule(email:string,schedule: any) {
    try {
      this.spinner.show();
      await this.afs.collection('schedules').doc(email).update({...schedule})
      setTimeout(() => {
        this.toastr.success('Horarios registrado exitosamente');
      }, 1000);
    } catch (error: any) {
      if(error.code === 'not-found'){
        await this.afs.collection('schedules').doc(email).set({...schedule})
        setTimeout(() => {
          this.toastr.success('Horarios registrado exitosamente');
        }, 1000);
        return
      }
      this.toastr.error('Ocurrió un error al registar el horario');
      console.log(error);
    } finally {
      this.spinner.hide();
    }
  }

  async loadHours(email: string) {
    try {
      this.spinner.show();
      await this.afs.collection<any>('schedules').doc(email).get().subscribe(data => {
        this.schedule = data.data();
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
