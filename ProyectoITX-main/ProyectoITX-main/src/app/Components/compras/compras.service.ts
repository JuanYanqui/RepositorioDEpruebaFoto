import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Compra } from './compra';
import { CompraDetail } from './compradetail';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private url = environment.baseUrl;
  constructor(private http: HttpClient) {}

  addCompra(compra: CompraDetail): Observable<any> {
    return this.http.post<any>(`${this.url}/compra`, compra);
  }
  getCompra(): Observable<CompraDetail[]> {
    return this.http.get<CompraDetail[]>(`${this.url}/compras`);
  }
  getCompraById(compra: Compra): Observable<Compra> {
    return this.http.get<Compra>(`${this.url}/compra/${compra.id}`);
  }
    changeStatusById(id: number, status: string): Observable<any> {
        let params = new HttpParams().set('status', status);
        return this.http.put<any>(`${this.url}/compra-status/${id}`,{}, {
            params:params,
        });
  }
}
