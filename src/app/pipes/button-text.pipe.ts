import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buttonText'
})
export class ButtonTextPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch(value){
      case 'Pendiente':
        return "Cancelar turno"
      case 'Atendido':
        return "Calificar atención"
      case 'PrevioCompletado':
        return "Completar encuesta"
      case 'Cancelado':
      case 'Completado':
      case 'Terminado':
        return "Ver reseña"
      default:
        return ""
    }
  }

}
