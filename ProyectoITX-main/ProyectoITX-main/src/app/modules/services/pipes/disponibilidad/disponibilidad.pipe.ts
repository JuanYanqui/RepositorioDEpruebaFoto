import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'disponibilidad',
})
export class DisponibilidadPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value ? 'Disponible' : 'No disponible';
  }
}
