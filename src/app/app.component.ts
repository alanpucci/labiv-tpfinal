import { transition, trigger, useAnimation } from '@angular/animations';
import { Component } from '@angular/core';
import { moveFromLeft, moveFromRight, rotateCarouselToBottom, rotateCarouselToRight, rotateCubeToBottom, rotateCubeToLeft, rotateFlipToBottom, rotateFlipToRight, slide } from 'ngx-router-animations';

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
    trigger('slide', [
      transition('* => request-appointment', useAnimation(slide))
    ]),
  ]
})
export class AppComponent {
  title = 'tp-final';

  public getState(outlet:any) {
    return outlet.activatedRouteData.state;
  }
}
