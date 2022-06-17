import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private spinner:NgxSpinnerService, private storage: AngularFireStorage, private sanitizer:DomSanitizer) { }

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

  public async getImgUrl(img:string) {
    this.spinner.show();
    const url = await this.storage.ref(img).getDownloadURL();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    return url;
  }
}
