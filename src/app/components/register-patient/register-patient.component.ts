import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit, OnChanges {
  
  @Input() signedUp:boolean=false;
  @Output() newPatient=new EventEmitter<User>();
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
      Object.keys(this.signUpForm.controls).forEach(key => {
        this.signUpForm.get(key)?.setErrors(null) ;
      });
    }
  }

  handleRegister(){
    if(this.signUpForm.valid){
      this.signUpForm.value["type"]="paciente";
      this.newPatient.emit(this.signUpForm.value);
    }else{
      this.toast.error("Todos los campos son requeridos")
    }
  }

}
