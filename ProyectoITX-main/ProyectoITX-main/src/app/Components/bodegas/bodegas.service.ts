import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bodega } from './bodega';

@Injectable({
  providedIn: 'root',
})
export class BodegasService {
  private url = environment.baseUrl;
  constructor(private http: HttpClient) {}
  addBodega(bodega: Bodega): Observable<any> {
    return this.http.post(`${this.url}/bodega`, bodega);
  }

  updateBodega(bodega: Bodega, id: string): Observable<any> {
    return this.http.put(`${this.url}/bodega/${id}`, bodega);
  }

  getBodega(): Observable<Bodega[]> {
    return this.http.get<Bodega[]>(`${this.url}/bodegas`);
  }

  getBodegaById(id: string): Observable<Bodega> {
    return this.http.get<Bodega>(`${this.url}/bodega/${id}`);
  }

  getBodegaByName(nombre: string): Observable<Bodega> {
    return this.http.get<Bodega>(`${this.url}/bodega?nombre=${nombre}`);
  }

  getByEmpresa(id: any) {
    return this.http.get<Bodega[]>(`${this.url}/bodegas/${id}`);
  }
}
