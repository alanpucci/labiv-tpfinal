import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user/user';
import { ERROR, SUCCESS } from './auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router, private afs: AngularFirestore, private auth: AngularFireAuth, private spinner: NgxSpinnerService, private ngZone:NgZone, private toastr: ToastrService) { }

  showError(error:ERROR){
    switch(error){
      case ERROR.INVALID_EMAIL:
          this.toastr.error("El email es inválido");
          break;
      case ERROR.EMAIL_ALREADY_IN_USE:
          this.toastr.error("El email ingresado ya está registrado");
          break;
      case ERROR.WEAK_PASSWORD:
          this.toastr.error("La contraseña debe tener un mínimo de 6 carácteres");
      break;
      case ERROR.USER_NOT_FOUND:
      case ERROR.WRONG_PASSWORD:
          this.toastr.error("Email y/o contraseña inválido");
      break;
      case ERROR.EMPTY_FIELDS:
          this.toastr.error("Todos los campos son obligatorios");
      break;
      case ERROR.DIFFERENT_PASSWORDS:
          this.toastr.error("Las contraseñas no coinciden");
      break;
      default:
          this.toastr.error("Ha ocurrido un error, por favor reintente nuevamente");
      break;
    }
  }

  showSuccess(success:any){
    switch(success){
      case SUCCESS.SIGNED_UP:
        this.toastr.success("Cuenta creada exitosamente");
      break;
    }
  }

  async signIn(email:string, password:string) {
    try {
      this.spinner.show();
      if(!email || !password) return this.showError(ERROR.EMPTY_FIELDS);
      const userDB = await this.auth.signInWithEmailAndPassword(email, password)
      if(userDB){
        await this.afs.collection('users', ref => ref.where('email', '==', email)).get().subscribe(data => {
          console.log(data)
          sessionStorage.setItem('user', JSON.stringify(data));
        });
        this.ngZone.run(() => {
          this.router.navigateByUrl('/home');
        });
      }
    } catch (error:any) {
      console.log(error.code);
      this.showError(error.code);
    } finally{
      this.spinner.hide();
    }
  }

  async signUp(userData:User) {
    try {
      this.spinner.show();
      if(userData.password !== userData.repeatPassword) return this.showError(ERROR.DIFFERENT_PASSWORDS);
      const user = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password!)
      await this.addUserData(userData);
      if(user){
        this.toastr.success("Cuenta creada exitosamente");
        return true;
      }
    } catch (error:any) {
      console.log(error)
      this.showError(error.code);
      return false;
    } finally{
      this.spinner.hide();
    }
  }

  async logout(){
    await this.auth.signOut();
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  getUserData(){
    return JSON.parse(sessionStorage.getItem('user')!);
  }

  async addUserData(user: User) {
    try {
      await this.afs.collection('users').add({
        ...user
      })
    } catch (error:any) {
      this.showError(error.code)      
    }
  }
}
