import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto } from './producto';
@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private url = environment.baseUrl;

  constructor(private http: HttpClient) {}

    addProduct(producto: Producto): Observable<Producto> {

    return this.http.post<any>(
      `${this.url}/producto`,
      producto
    );
  }


  getProduct(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/productos`);
  }
  updateProduct(producto: Producto, id: string): Observable<any> {
    return this.http.put(`${this.url}/producto/${id}`, producto);
  }
  update_cantidad_Product(id: string, cantidad: number): Observable<any> {
    const params = new HttpParams().set('cantidad', cantidad);
    return this.http.put(
      `${this.url}/update-product/cantidades/${id}`,
      {},
      { params: params }
    );
  }
  getProductById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/producto/${id}`);
  }
  getProductByName(nombre: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/producto?nombre=${nombre}`);
  }

  getProductsByEmpresa(idEmpresa: any){
    return this.http.get<Producto[]>(`${this.url}/listaproductos/${idEmpresa}`)
  }

  getProductsByEmpresa2(idEmpresa: any):Observable<any> {
    return this.http.get<Producto[]>(`${this.url}/products/${idEmpresa}`);
  }
}
