import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUserType]'
})
export class UserTypeDirective {
  @Input('type') type: string | undefined;

  constructor(private readonly elementRef: ElementRef,
    private renderer: Renderer2) { }

  ngAfterViewInit(){
    const colors:any = {paciente: 'rgb(216 204 242)', especialista:'rgb(141 154 255)', admin:'rgb(178 217 239)'}
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-color',
      colors[this.type!],
    );
  }

}
