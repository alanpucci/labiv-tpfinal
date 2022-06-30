import { SpecialitiesService } from './../../services/specialities/specialities.service';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-register-specialist',
  templateUrl: './register-specialist.component.html',
  styleUrls: ['./register-specialist.component.css']
})
export class RegisterSpecialistComponent implements OnInit, OnChanges {

  captcha:boolean=false;
  firstImage:File|null=null;
  @Input() signedUp:boolean=false;
  @Output() newSpecialist=new EventEmitter<User>();
  @Output() goBack=new EventEmitter<any>();
  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.required, Validators.min(18), Validators.max(99)]),
    dni: new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.required, Validators.maxLength(8)]),
    speciality: new FormControl('', Validators.required),
    anotherSpeciality: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
  })
  constructor(private toast:ToastrService, public specialitiesService:SpecialitiesService) { }

  ngOnInit(): void {
    this.specialitiesService.loadSpecialities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.signedUp){
      this.signUpForm.reset();
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
      if(!this.firstImage || !this.signUpForm.valid || !this.captcha) throw new Error()
      if(!!this.signUpForm.get('anotherSpeciality')?.value){
        this.signUpForm.value["speciality"].push(this.signUpForm.get('anotherSpeciality')?.value);
      }
      delete this.signUpForm.value['anotherSpeciality']
      this.signUpForm.value["type"]="especialista";
      this.signUpForm.value["files"]=[this.firstImage];
      this.firstImage=null
      this.newSpecialist.emit(this.signUpForm.value);
    } catch (error) {
      this.toast.error("Todos los campos son requeridos")
    }
  }

  onFileSelected(event:any) {
      this.firstImage=event.target.files[0];
  }

  handleGoBack(){
    this.goBack.emit();
  }

}
