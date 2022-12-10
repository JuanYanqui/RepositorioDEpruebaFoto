import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empresa } from '../Models/Empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private URL = "http://localhost:5000/empresa/";

  constructor(private http: HttpClient) { }

  getEmpresas(){
    return this.http.get<Empresa[]>(this.URL+'/listar');
  }

  getPorId(idEmpresa: number){
    return this.http.get<Empresa>(this.URL+idEmpresa);
  }

  postEmpresa(empresa: Empresa){
    return this.http.post<Empresa>(this.URL+'?', empresa);
  }

  updateEmpresa(empresa: Empresa, idEmpresa: any){
    return this.http.put<Empresa>(this.URL+`actualizar/${idEmpresa}`, empresa);
  }

  deleteEmpresa(idEmpresa: number){
    return this.http.delete<boolean>(this.URL+`eliminar/${idEmpresa}`);
  }

  getPorPersona(idPersona: number){
    return this.http.get<Empresa>(this.URL+`porPersona/${idPersona}`)
  }

  verfRuc(ruc: string){
    return this.http.get<boolean>(this.URL+`porRuc/${ruc}`);
  }
}
