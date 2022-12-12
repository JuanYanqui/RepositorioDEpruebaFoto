import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VigilanteClientAdminGuard implements CanActivate {

  flag!: boolean;

  constructor(private usuarioService: UsuarioService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let idUsuario = localStorage.getItem('idUsuario');

      this.usuarioService.getPorId(idUsuario).subscribe(
        data => {
          if (data != null && data.estado != false && data.rol?.nombre.toUpperCase() === 'CLIENTE ADMINISTRADOR'){
            console.log("usuario encontrado")
            this.flag = true;
          }else{
            console.log("usuario no encontrado o sin permisos")
            localStorage.removeItem('idUsuario');
            location.replace('/log-in');
            this.flag = false;
          }
        }
      );

      console.log('bandera ' + this.flag);
      return this.flag;
  }

}
