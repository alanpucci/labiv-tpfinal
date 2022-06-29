import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {

  captcha:any=[]
  enteredCaptcha:any;
  @Output() captchaResult=new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
    this.createCaptcha();
  }

  createCaptcha() {
    const activeCaptcha = document.getElementById("captcha");
    let captcha = []
    for (let q = 0; q < 6; q++) {
      if (q % 2 == 0) {
        captcha[q] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
      } else {
        captcha[q] = Math.floor(Math.random() * 10 + 0);
      }
    }
    const theCaptcha = captcha.join("");
    this.captcha = theCaptcha;
    activeCaptcha!.innerHTML = `${theCaptcha}`;
  }

  validateCaptcha() {
    this.captchaResult.emit(this.enteredCaptcha === this.captcha);
  }

}
