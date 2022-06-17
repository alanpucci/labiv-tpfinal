import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: {nanoseconds:number,seconds:number}, ...args: unknown[]): unknown {
    return new Date(value.seconds*1000).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour:'2-digit',
      minute:'2-digit'
    })
  }

}
