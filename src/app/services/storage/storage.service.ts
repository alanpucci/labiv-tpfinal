import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private spinner:NgxSpinnerService, private storage: AngularFireStorage) { }

  //Tarea para subir archivo
  public upload(nombreArchivo: string, datos: any) {
    try {
      this.spinner.show();
      return this.storage.upload(nombreArchivo, datos);
    } catch (error) {
      throw ({code:"Error"})
    } finally{
      this.spinner.hide();
    }
  }

  //Referencia del archivo
  public ref(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
}
