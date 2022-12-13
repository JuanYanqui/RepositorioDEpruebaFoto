import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DisponibilidadPipe } from './disponibilidad.pipe';

@NgModule({
  declarations: [DisponibilidadPipe],
  imports: [CommonModule],
  exports: [DisponibilidadPipe],
})
export class DisponibilidadModule {}
