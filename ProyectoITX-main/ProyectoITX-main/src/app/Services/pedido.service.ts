import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../Models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private URL = "http://localhost:5000/pedido/";

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<Pedido[]>(`${this.URL}/listar`);
  }

  getById(idPedido: number){
    return this.http.get<Pedido>(this.URL+idPedido);
  }

  post(pedido: Pedido){
    return this.http.post<Pedido>(this.URL, pedido);
  }

  update(pedido: Pedido, idPedido: any){
    return this.http.put<Pedido>(`${this.URL}actualizar/${idPedido}`, pedido);
  }

  delete(idPedido: number){
    return this.http.delete<boolean>(`${this.URL}eliminar/${idPedido}`);
  }

  getByEmpresa(idEmpresa: any){
    return this.http.get<Pedido[]>(`${this.URL}listarporempresa/${idEmpresa}`);
  }

  getByCliente(idCliente: any){
    return this.http.get<Pedido[]>(`${this.URL}listarporcliente/${idCliente}`);
  }
}
