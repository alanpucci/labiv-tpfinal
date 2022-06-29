import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { moveFromRight, rotateFlipToBottom, rotateCubeToLeft, rotateCubeToBottom, rotateCarouselToBottom, slide } from 'ngx-router-animations';
import { User } from 'src/app/models/user/user';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('moveFromRight', [
      transition('* => login', useAnimation(moveFromRight))
    ]),
    trigger('rotateFlipToBottom', [
      transition('* => welcome', useAnimation(rotateFlipToBottom))
    ]),
    trigger('rotateCubeToLeft', [
      transition('* => profile', useAnimation(rotateCubeToLeft))
    ]),
    trigger('rotateCubeToBottom', [
      transition('* => appointments', useAnimation(rotateCubeToBottom))
    ]),
    trigger('rotateCarouselToBottom', [
      transition('* => list-users', useAnimation(rotateCarouselToBottom))
    ]),
    trigger('slide', [
      transition('* => request-appointment', useAnimation(slide))
    ]),
  ]
})
export class HomeComponent implements OnInit {

  userData:User=new User();
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.userData = this.auth.getUserData();
  }

  public getState(outlet:any) {
    return outlet.activatedRouteData.state;
  }

}
