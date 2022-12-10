import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../Models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URL = "http://localhost:5000/usuario/";

  constructor(private http: HttpClient) { }

  getUsuarios(){
    return this.http.get<Usuario[]>(this.URL+'listar');
  }

  getPorId(idUsuario: any){
    return this.http.get<Usuario>(this.URL+idUsuario);
  }

  postUsuario(usuario: Usuario){
    return this.http.post<Usuario>(this.URL+'?', usuario);
  }

  updateUsuario(usuario: Usuario, idUsuario: any){
    return this.http.put<Usuario>(this.URL+`actualizar/${idUsuario}`, usuario);
  }

  deleteUsuario(idUsuario: number){
    return this.http.delete<boolean>(this.URL+`eliminar/${idUsuario}`);
  }

  login(username: string, password: string){
    return this.http.get<Usuario>(this.URL+`login/${username}/${password}`)
  }

  verfUsername(username: string){
    return this.http.get<boolean>(this.URL+`porUsername/${username}`)
  }
}
