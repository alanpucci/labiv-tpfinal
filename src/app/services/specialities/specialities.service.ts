import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpecialitiesService {

  specialities:any[]=[];
  constructor(private spinner:NgxSpinnerService,private afs: AngularFirestore) { }

  async loadSpecialities() {
    try {
      this.spinner.show();
      this.specialities = [];
      const itemsCollection = this.afs.collection<any>('specialities');
      itemsCollection.get().subscribe(snapshot => {
        snapshot.forEach(speciality=> {
          this.specialities.unshift(speciality.data());
        })
      });
      setTimeout(() => {
        this.spinner.hide();
      }, 1000)
    } catch (error) {
      console.log(error)
      this.spinner.hide();
      return
    }
  }
}
