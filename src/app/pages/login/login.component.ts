import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signedUp:boolean=false;
  checkbox:boolean=false;
  signUpType:string="";
  signIn = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  })

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
  }

  async handleSignUp(userData:User){
    const res = await this.auth.signUp(userData)
    if(res){
      this.signedUp=true;
    }
  }

  async handleSignIn(){
    await this.auth.signIn(this.signIn.get('email')?.value, this.signIn.get('password')?.value);
  }

  pressImage(img:string) {
    this.signUpType=img;
  }

  handleGoBack(){
    this.signUpType="";
  }


}
