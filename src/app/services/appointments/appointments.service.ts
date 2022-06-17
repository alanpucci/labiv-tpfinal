import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  appointments: any;
  filteredAppointments: any;
  selectedAppointment:any;
  constructor(
    private spinner: NgxSpinnerService,
    private afs: AngularFirestore,
    private toastr: ToastrService
  ) {}

  async registerAppointment(appointment: any) {
    try {
      this.spinner.show();
      await this.afs.collection('appointments').add({
        ...appointment,
      });
      setTimeout(() => {
        this.toastr.success('Turno registrado exitosamente');
      }, 1000);
    } catch (error: any) {
      this.toastr.error('Ocurrió un error al solicitar el turno');
      console.log(error);
    } finally {
      this.spinner.hide();
    }
  }

  async loadAppointments(type: string, user: string) {
    try {
      this.spinner.show();
      this.appointments = [];
      const itemsCollection = this.afs.collection<any>('appointments', (ref) =>
        ref.where(
          type === 'paciente' ? 'patientEmail' : 'specialistEmail',
          '==',
          user
        )
      );
      itemsCollection.get().subscribe((snapshot) => {
        snapshot.forEach((appointment) => {
          this.appointments.unshift({...appointment.data(),id:appointment.id});
        });
      });
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    } catch (error) {
      console.log(error);
      this.spinner.hide();
      return;
    }
  }

  async getAppointment(id:string) {
    try {
      this.spinner.show();
      this.selectedAppointment = null;
      const itemCollection = this.afs.collection('appointments').doc(id);
      itemCollection.get().subscribe((snapshot) => {
        this.selectedAppointment = snapshot.data();
      });
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    } catch (error) {
      console.log(error);
      this.spinner.hide();
      return;
    }
  }


  async updateAppointment(id:string, type:string, email:string, body:any){
    try {
      this.spinner.show();
      this.afs.collection('appointments').doc(id).update(body);
      setTimeout(async ()=>{
        this.spinner.hide();
        await this.loadAppointments(type,email);
      },1000)
    } catch (error) {
      console.log(error)
      this.spinner.hide();
      return
    } finally{
    }
  }

  filterAppointments(text: string, userType: string) {
    this.filteredAppointments = this.appointments.filter((appointment: any) =>
      userType === 'paciente'
        ? appointment.specialistName.toUpperCase().indexOf(text.toUpperCase()) >
          -1
        : appointment.patientName.toUpperCase().indexOf(text.toUpperCase()) >
            -1 ||
          appointment.speciality.toUpperCase().indexOf(text.toUpperCase()) > -1
    );
  }
}
