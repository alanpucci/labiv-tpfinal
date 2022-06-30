import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: {nanoseconds:number,seconds:number} | any, ...args: unknown[]): unknown {
    if(args[0] === 'isoString'){
      const date = new Date(value);
      return date.toLocaleString();
    }else{
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

}
