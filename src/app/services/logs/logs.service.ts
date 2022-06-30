import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user/user';

@Injectable({
  providedIn: 'root',
})
export class LogsService {

  logs:any;
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private afs: AngularFirestore
  ) {}

  async registerMedicalRecord(user: User) {
    try {
      this.spinner.show();
      await this.afs
        .collection('logs')
        .doc(user.email)
        .update({ [new Date().toISOString()]: new Date().toISOString() });
    } catch (error: any) {
      if (error.code === 'not-found') {
        await this.afs
          .collection('logs')
          .doc(user.email)
          .set({
            user: `${user.name} ${user.lastName}`,
            [new Date().toISOString().split('.')[0]]: new Date().toISOString(),
          });
        return;
      }
      console.log(error);
    } finally {
      this.spinner.hide();
    }
  }

  async getLogs() {
    try {
      this.spinner.show();
      this.logs = [];
      const itemsCollection = this.afs.collection<any>('logs');
      itemsCollection.get().subscribe(snapshot => {
        snapshot.forEach(log=> {
          const logAux = log.data();
          Object.keys(logAux).map((key, index) => {
            if(key !== 'user'){
              const date = key.split('T')
              let day:any = date[0].split("-"); 
              day = day[2]+ "-" +day[1]+ "-" +day[0];
              this.logs.unshift({user:logAux.user,day, time:date[1]});
            }
          });
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
