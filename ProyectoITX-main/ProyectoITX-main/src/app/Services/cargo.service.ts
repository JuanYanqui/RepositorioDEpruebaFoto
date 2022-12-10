import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cargo } from '../Models/cargo';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private URL = "http://localhost:5000/cargo/";

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<Cargo[]>(this.URL+'listar');
  }

  getPorId(idCargo: any){
    return this.http.get<Cargo>(this.URL+idCargo);
  }

  post(cargo: Cargo){
    return this.http.post<Cargo>(this.URL+'?', cargo);
  }

  update(cargo: Cargo, idCargo: any){
    return this.http.put<Cargo>(this.URL+`actualizar/${idCargo}`, cargo);
  }

  delete(idCargo: number){
    return this.http.delete<boolean>(this.URL+`eliminar/${idCargo}`);
  }
}
