import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Proveedor } from 'src/app/Models/mocks/proveedor';
import { Categoria } from './categoria';
import { CATEGORIAS } from './mock-categorias';
import { PROVEEDORES } from './mock-proveedor';
import { UNIDADMEDIDA } from './mock-unidadMedida';
import { UnidadMedida } from './unidadMedida';

@Injectable({
  providedIn: 'root',
})
export class MoocksServices {
  constructor() {}
  getProveedores(): Observable<Proveedor[]> {
    return of(PROVEEDORES);
  }
  getCategorias(): Observable<Categoria[]> {
    return of(CATEGORIAS);
  }
  getUnidades(): Observable<UnidadMedida[]> {
    return of(UNIDADMEDIDA);
  }
}
