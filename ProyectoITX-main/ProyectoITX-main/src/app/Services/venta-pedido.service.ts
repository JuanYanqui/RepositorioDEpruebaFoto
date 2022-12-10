import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { VentaPedido } from '../Models/venta-pedido';

@Injectable({
  providedIn: 'root'
})
export class VentaPedidoService {

  private URL = "http://localhost:5000/ventapedido/";

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<VentaPedido[]>(`${this.URL}/listar`);
  }

  getById(idVentaPedido: number){
    return this.http.get<VentaPedido>(this.URL+idVentaPedido);
  }

  post(ventaPedido: VentaPedido){
    return this.http.post<VentaPedido>(this.URL, ventaPedido);
  }

  update(ventaPedido: VentaPedido, idVentaPedido: any){
    return this.http.put<VentaPedido>(`${this.URL}actualizar/${idVentaPedido}`, ventaPedido);
  }

  delete(idVentaPedido: number){
    return this.http.delete<boolean>(`${this.URL}eliminar/${idVentaPedido}`);
  }

  porPedido(idPedido: any){
    return this.http.get<VentaPedido>(`${this.URL}porpedido/${idPedido}`);
  }

  porEmpresaIsOnline(idEmpresa: any, isOnline: boolean){
    return this.http.get<VentaPedido[]>(`${this.URL}listarporempresa/${idEmpresa}/${isOnline}`)
  }

}
