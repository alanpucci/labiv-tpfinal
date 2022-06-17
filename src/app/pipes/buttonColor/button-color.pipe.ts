import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buttonColor'
})
export class ButtonColorPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch(value){
      case 'Pendiente':
        return "btn-danger"
      case 'Atendido':
      case 'PrevioCompletado':
        return "btn-success"
      case 'Cancelado':
      case 'Completado':
      case 'Terminado':
        return "btn-info"
      default:
        return "Pendiente"
    }
  }

}
