import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Roles } from '../Models/Roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private URL = "http://localhost:5000/roles/";

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<Roles[]>(this.URL+'listar')
  }
  
  getById(idRol: number){
    return this.http.get<Roles>(this.URL+idRol);
  }

  post(rol: Roles){
    return this.http.post<Roles>(this.URL+'?', rol);
  }

  delete(idRol: number){
    return this.http.delete<boolean>(this.URL+`eliminar/${idRol}`)
  }

  getByName(nombre: string){
    return this.http.get<Roles>(this.URL+`byName/${nombre}`);
  }
}
