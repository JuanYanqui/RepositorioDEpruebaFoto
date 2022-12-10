import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ControlInventarios } from './control-inventarios';
@Injectable({
  providedIn: 'root'
})
export class ControlInventariosService {

  private url = environment.baseUrl;

  constructor (private http: HttpClient) {}


  addInventario(bodega: ControlInventarios): Observable<any> {
    return this.http.post(`${ this.url }/control-mer`, bodega);
  }

  updateInventario(bodega: ControlInventarios, id: string): Observable<any> {
    return this.http.put(`${ this.url }/control-mer/${ id }`, bodega);
  }

  getInventario(): Observable<ControlInventarios[]> {
    return this.http.get<ControlInventarios[]>(`${ this.url }/control-mers`);
  }

  getInventarioById(id: string): Observable<ControlInventarios> {
    return this.http.get<ControlInventarios>(`${ this.url }/control-mer/${ id }`);
  }

  // getInventarioByName(nombre: string): Observable<ControlInventarios> {
  //   return this.http.get<ControlInventarios>(`${ this.url }/control-mer?nombre=${ nombre }`);
  // }

  getByEmpresa(id: any) {
    return this.http.get<ControlInventarios[]>(`${ this.url }/control-mer/${ id }`);
  }
}
