import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Clientes } from '../Models/clientes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private http:HttpClient) { }
  private URL='http://localhost:5000/cliente';

  save(cliente:Clientes):Observable<any>{
    return this.http.post<Clientes>(`${this.URL}/`,cliente);
  }
  listar():Observable<any>{
    return this.http.get(`${this.URL}/listar`);
  }
  porId(idcliente:any):Observable<any>{
    return this.http.get<Clientes>(this.URL+'/'+idcliente);
  }
  updateclientes(clientes:Clientes, idcliente:any){
    return this.http.put<Clientes>(this.URL+`/actualizar/${idcliente}`,clientes);
  }

  getByEmpresa(idEmpresa: any){
    return this.http.get<Clientes[]>(this.URL+`/listarPorEmpresa/${idEmpresa}`);
  }

  getByEmpresaUsuario(idUsuario: any, idEmpresa: any){
    return this.http.get<Clientes>(`${this.URL}/listarPorUsuarioAndEmpresa/${idUsuario}/${idEmpresa}`)
  }

}
