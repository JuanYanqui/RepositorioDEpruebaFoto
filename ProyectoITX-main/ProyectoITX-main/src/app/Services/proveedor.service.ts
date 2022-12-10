import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from '../Models/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  constructor(private http:HttpClient) { }
  private URL='http://localhost:5000/proveedor';

  save(proveedor:Proveedor):Observable<any>{
      return this.http.post(`${this.URL}/`,proveedor);
  }
  listarProveedor():Observable<any>{
     return this.http.get(`${this.URL}/listarproveedor`)
  }
  listarporId(idProvedor:any):Observable<any>{
     return this.http.get<Proveedor>(this.URL+'/'+idProvedor)
  }
  updateProveedor(proveedor:Proveedor, idProveedor:any){
    return this.http.put<Proveedor>(this.URL+`/actualizarProveedor/${idProveedor}`,proveedor);
  }

  getByEmpresa(idEmpresa: any):Observable<any>{
    return this.http.get<Proveedor[]>(`${this.URL}/listbyempresa/${idEmpresa}`)
  }
}
