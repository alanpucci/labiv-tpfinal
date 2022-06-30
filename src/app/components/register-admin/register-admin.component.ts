import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})
export class RegisterAdminComponent implements OnInit {

  captcha:boolean=false;
  image:File|null=null;
  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.required, Validators.min(18), Validators.max(99)]),
    dni: new FormControl('',[Validators.pattern("^[0-9]*$"),Validators.required, Validators.maxLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
  })

  constructor(private toast:ToastrService, private auth:AuthService) { }

  ngOnInit(): void {
  }

  async handleRegister(){
    try {
      if(!this.image || !this.signUpForm.valid || !this.captcha) throw new Error()
      this.signUpForm.value["type"]="admin";
      this.signUpForm.value["files"]=[this.image];
      this.image=null
      const res = await this.auth.signUp(this.signUpForm.value)
      if(res){
        this.signUpForm.reset();
        this.image=null;
      }
    } catch (error) {
      this.toast.error("Todos los campos son requeridos")
    }
  }

  validateCaptcha(value:any){
    console.log(value)
    this.captcha=value
  }

  onFileSelected(event:any, first:boolean) {
    this.image=event.target.files[0];
  }

}
