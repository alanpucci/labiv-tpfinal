import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user/user';
import { finalize, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit, OnChanges {

  firstImage:File|null=null;
  secondImage:File|null=null;
  token:string|undefined;
  captcha:boolean=false;
  @Input() signedUp:boolean=false;
  @Output() newPatient=new EventEmitter<User>();
  @Output() goBack=new EventEmitter<any>();
  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.required, Validators.min(18), Validators.max(99)]),
    dni: new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.required, Validators.maxLength(8)]),
    socialWork: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
  })
  constructor(private toast:ToastrService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.signedUp){
      this.signUpForm.reset();
      this.firstImage = null;
      this.secondImage = null;
      Object.keys(this.signUpForm.controls).forEach(key => {
        this.signUpForm.get(key)?.setErrors(null) ;
      });
    }
  }

  validateCaptcha(value:any){
    console.log(value)
    this.captcha=value
  }

  handleRegister(){
    try {
      if(!this.firstImage || !this.secondImage || !this.signUpForm.valid || !this.captcha) throw new Error()
      this.signUpForm.value["type"]="paciente";
      this.signUpForm.value["files"]=[this.firstImage, this.secondImage];
      this.firstImage=null
      this.secondImage=null
      this.newPatient.emit(this.signUpForm.value);
    } catch (error) {
      this.toast.error("Todos los campos son requeridos")
    }
  }

  onFileSelected(event:any, first:boolean) {
    if(first){
      this.firstImage=event.target.files[0];
    }else{
      this.secondImage=event.target.files[0];
    }
  }

  handleGoBack(){
    this.goBack.emit();
  }

}
