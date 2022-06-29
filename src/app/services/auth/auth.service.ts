import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { StorageService } from '../storage/storage.service';
import { ERROR, SUCCESS } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  fastSignInUsers: string[] = [
    'especialista1@gmail.com',
    'especialista2@gmail.com',
    'paciente1@gmail.com',
    'paciente2@gmail.com',
    'paciente3@gmail.com',
    'admin@gmail.com',
  ];
  loggedUser:User|undefined;
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private spinner: NgxSpinnerService,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private storage:StorageService
  ) {}

  showError(error: ERROR) {
    switch (error) {
      case ERROR.INVALID_EMAIL:
        this.toastr.error('El email es inválido');
        break;
      case ERROR.EMAIL_ALREADY_IN_USE:
        this.toastr.error('El email ingresado ya está registrado');
        break;
      case ERROR.WEAK_PASSWORD:
        this.toastr.error('La contraseña debe tener un mínimo de 6 carácteres');
        break;
      case ERROR.USER_NOT_FOUND:
      case ERROR.WRONG_PASSWORD:
        this.toastr.error('Email y/o contraseña inválido');
        break;
      case ERROR.EMPTY_FIELDS:
        this.toastr.error('Todos los campos son obligatorios');
        break;
      case ERROR.DIFFERENT_PASSWORDS:
        this.toastr.error('Las contraseñas no coinciden');
        break;
      case ERROR.PENDING_USER:
        this.toastr.error('Usuario pendiente de validación');
        break;
      case ERROR.PENDING_USER:
        this.toastr.error('Usuario inactivo');
      break;
      default:
        this.toastr.error(
          'Ha ocurrido un error, por favor reintente nuevamente'
        );
        break;
    }
  }

  showSuccess(success: any) {
    switch (success) {
      case SUCCESS.SIGNED_UP:
        this.toastr.success('Cuenta creada exitosamente');
        break;
    }
  }

  //TODO: Refactorizar esta función asquerosa
  async signIn(email: string, password: string) {
    try {
      if (!email || !password){
        this.showError(ERROR.EMPTY_FIELDS);
        return
      } 
      this.spinner.show();
      await this.afs
        .collection('users', (ref) => ref.where('email', '==', email))
        .get()
        .subscribe((snapshot) => {
          snapshot.forEach(async (res:any) => {
            const data: any = {...res.data(),id:res.id};
            if (data.state === 'pendiente') {
              this.toastr.error('Usuario pendiente de validación');
              this.spinner.hide();
              return;
            }
            if (data.state === 'inactivo') {
              this.toastr.error('Usuario inactivo');
              this.spinner.hide();
              return;
            }
            try {
              const userDB = await this.auth.signInWithEmailAndPassword(
                email,
                password
              );
              if(!this.fastSignInUsers.includes(userDB.user?.email!) && !userDB.user?.emailVerified){
                this.toastr.error('Usuario pendiente de validación');
                this.spinner.hide();
                return;
              }
              
              sessionStorage.setItem('user', JSON.stringify(data));
              this.ngZone.run(() => {
                this.loggedUser = data;
                this.router.navigateByUrl('/home');
                this.spinner.hide();
              });
            } catch (error:any) {
              this.showError(error.code);
              this.spinner.hide();
            }
          });
        });
    } catch (error: any) {
      console.log(error.code);
    }
  }

  async signUp(userData: User) {
    try {
      this.spinner.show();
      if (userData.password !== userData.repeatPassword)
        return this.showError(ERROR.DIFFERENT_PASSWORDS);
      const user = await this.auth.createUserWithEmailAndPassword(
        userData.email,
        userData.password!
      );
      let files:string[]=[];
      userData.files?.forEach(async (file, index) => {
        const fileName = `images/${userData.email}-${index}-${file.name}`;
        files.push(fileName);
        await this.storage.upload(fileName, file);
      })
      userData["images"] = files;
      userData["creationDate"] = new Date();
      userData["state"] = "pendiente"
      delete userData['password']
      delete userData['repeatPassword']
      delete userData["files"];
      await this.addUserData(userData);
      await user.user?.sendEmailVerification();
      if (user) {
        this.toastr.success('Cuenta creada exitosamente');
        return true;
      }
    } catch (error: any) {
      console.log(error);
      this.showError(error.code);
      return false;
    } finally {
      this.spinner.hide();
    }
  }

  async logout() {
    await this.auth.signOut();
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  getUserData():User {
    return JSON.parse(sessionStorage.getItem('user')!);
  }

  async addUserData(user: User) {
    try {
      await this.afs.collection('users').add({
        ...user,
      });
    } catch (error: any) {
      this.showError(error.code);
    }
  }
}
