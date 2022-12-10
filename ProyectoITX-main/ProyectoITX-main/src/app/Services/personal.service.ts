import { Injectable } from '@angular/core';
import { Personal } from '../Models/personal';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private URL='http://localhost:5000/personal';

  constructor(private http:HttpClient) { }

  save(personal:Personal){
    return this.http.post<Personal>(`${this.URL}/`,personal);
  }
  listarPersonal():Observable<any>{
    return this.http.get<Personal[]>(`${this.URL}/listar`);
  }
  updatePersonal(personal:Personal,idpersonal:any):Observable<any>{
     return this.http.put<Personal>(`${this.URL}/actualizar/${idpersonal}`,personal);
  }
  getbyid(idpersonal:any):Observable<any>{
    return this.http.get<Personal>(`${this.URL}/`+idpersonal);
  }
}
