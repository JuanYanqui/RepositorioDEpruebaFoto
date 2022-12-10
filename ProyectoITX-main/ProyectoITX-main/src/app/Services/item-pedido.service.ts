import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemPedido } from '../Models/item-pedido';

@Injectable({
  providedIn: 'root'
})
export class ItemPedidoService {

  private URL = "http://localhost:5000/itempedido/";

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<ItemPedido[]>(`${this.URL}listar`);
  }

  getById(idItemPedido: number){
    return this.http.get<ItemPedido>(this.URL+idItemPedido);
  }

  post(itemPedido: ItemPedido) {
    console.log(itemPedido);
    return this.http.post<ItemPedido>(this.URL, itemPedido);
  }

  update(itemPedido: ItemPedido, idItemPedido: any){
    return this.http.put<ItemPedido>(`${this.URL}actualizar/${idItemPedido}`, itemPedido);
  }

  delete(idItemPedido: number){
    return this.http.delete<boolean>(`${this.URL}eliminar/${idItemPedido}`);
  }

  getByPedido(idPedido: any){
    return this.http.get<ItemPedido[]>(`${this.URL}listarpedido/${idPedido}`)
  }
}
