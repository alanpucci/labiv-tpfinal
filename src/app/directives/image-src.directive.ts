import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appImageSrc]',
})
export class ImageSrcDirective {
  /** The native element. */
  el: HTMLElement | null = null;
  @Input('speciality') speciality: string | null = null;

  constructor(
    private readonly elementRef: ElementRef,
  ) {}

  ngAfterViewInit(): void {
    switch (this.speciality) {
      case 'Pediatría':
        this.elementRef.nativeElement.src = '../../assets/pediatria.png'
        break;
      case 'Cardiología':
        this.elementRef.nativeElement.src = '../../assets/cardiologia.png'
        break;
      case 'Traumatología':
        this.elementRef.nativeElement.src = '../../assets/traumatologia.png'
      break;
      case 'Dermatología':
        this.elementRef.nativeElement.src = '../../assets/dermatologia.png'
      break;
      case 'Cirugía':
        this.elementRef.nativeElement.src = '../../assets/cirugia.png'
      break;
      case 'Clínico':
        this.elementRef.nativeElement.src = '../../assets/clinico.png'
        break;
      default:
        this.elementRef.nativeElement.src = '../../assets/other.png'
        break;
    }
  }
}
