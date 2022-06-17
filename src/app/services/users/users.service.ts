import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../models/user/user';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private itemsCollection?: AngularFirestoreCollection<any>;
  public users: User[] = [];
  public specialists: User[] = [];
  
  constructor(
    private afs: AngularFirestore,
    private spinner: NgxSpinnerService,
  ) {}

  async loadUsers() {
    try {
      this.spinner.show();
      this.users = [];
      this.itemsCollection = this.afs.collection<User>('users');
      this.itemsCollection.get().subscribe(snapshot => {
        snapshot.forEach(user=> {
          this.users.unshift(user.data());
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

  async getSpecialists(speciality:string) {
    try {
      this.spinner.show();
      this.specialists = [];
      const itemsCollection = this.afs.collection<User>('users', (ref) => ref.where('speciality', '==', speciality));
      itemsCollection.get().subscribe(snapshot => {
        snapshot.forEach(user=> {
          this.specialists.unshift(user.data());
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

  async updateUser(email:string, body:any){
    try {
      this.spinner.show();
      const ref = await  this.afs.collection('users', (ref) => ref.where('email', '==', email)).get();
      ref.subscribe(res => {
        res.forEach(data => {
          this.afs.collection('users').doc(data.id).update(body);
        })
      });
      setTimeout(async ()=>{
        this.spinner.hide();
        await this.loadUsers();
      },1000)
    } catch (error) {
      console.log(error)
      this.spinner.hide();
      return
    } finally{
    }
  }
}
