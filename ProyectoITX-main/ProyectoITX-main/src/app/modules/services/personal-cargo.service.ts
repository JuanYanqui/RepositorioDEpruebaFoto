import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonalCargo } from '../Models/personal-cargo';

@Injectable({
  providedIn: 'root'
})
export class PersonalCargoService {

  private URL = "http://localhost:5000/personalCargo/";

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<PersonalCargo[]>(this.URL+'listar');
  }

  getPorId(idPersonalCargo: any){
    return this.http.get<PersonalCargo>(this.URL+idPersonalCargo);
  }

  post(personalCargo: PersonalCargo){
    return this.http.post<PersonalCargo>(this.URL+'?', personalCargo);
  }

  update(personalCargo: PersonalCargo, idPersonalCargo: any){
    return this.http.put<PersonalCargo>(this.URL+`actualizar/${idPersonalCargo}`, personalCargo);
  }

  delete(idPersonalCargo: number){
    return this.http.delete<boolean>(this.URL+`eliminar/${idPersonalCargo}`);
  }

  getByEmpresa(idEmpresa: any){
    return this.http.get<PersonalCargo[]>(this.URL+`listarPorEmpresa/${idEmpresa}`);
  }

  getByUsuario(idUsuario: any){
    return this.http.get<PersonalCargo[]>(`${this.URL}listarPorUsuario/${idUsuario}`);
  }

  getByEmpresaCargo(idEmpresa: any, nombreCargo: string){
    return this.http.get<PersonalCargo[]>(`${this.URL}listarPorEmpresaCargo/${idEmpresa}/${nombreCargo}`); 
  }
}
