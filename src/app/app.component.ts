import { transition, trigger, useAnimation } from '@angular/animations';
import { Component } from '@angular/core';
import { moveFromLeft, moveFromRight, rotateCarouselToBottom, rotateCarouselToLeft, rotateCarouselToRight, rotateCubeToBottom, rotateCubeToLeft, rotateCubeToTop, rotateFlipToBottom, rotateFlipToRight, slide } from 'ngx-router-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
    trigger('rotateCubeToTop', [
      transition('* => request-appointment', useAnimation(rotateCubeToTop))
    ]),
    trigger('slide', [
      transition('* => list-patients', useAnimation(slide))
    ]),
    trigger('slide', [
      transition('* => charts', useAnimation(slide))
    ]),
    trigger('rotateCarouselToLeft', [
      transition('* => register-admin', useAnimation(rotateCarouselToLeft))
    ]),
  ]
})
export class AppComponent {
  title = 'tp-final';

  public getState(outlet:any) {
    return outlet.activatedRouteData.state;
  }
}
