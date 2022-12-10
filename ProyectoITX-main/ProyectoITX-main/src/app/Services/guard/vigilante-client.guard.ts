import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UsuarioService } from '../usuario.service';


@Injectable({
  providedIn: 'root'
})
export class VigilanteClientGuard implements CanActivate {

  flag: boolean=false;

  constructor(private usuarioService: UsuarioService, private router: Router){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let idUsuario = localStorage.getItem('idUsuario');

      this.usuarioService
        .getPorId(idUsuario)
        .pipe(first())
        .subscribe();

      console.log('bandera ' + this.flag.valueOf);
      return this.flag;
  }

}
// {
//           next: (user) =>{ if (
//             user != null &&
//             user.estado != false &&
//             user.rol?.nombre.toUpperCase() === 'CLIENTE'
//           ) {
//             console.log('usuario encontrado');
//             this.flag = true;
//           } else {
//             console.log('usuario no encontrado o sin permisos');
//             localStorage.removeItem('idUsuario');
//             location.replace('/log-in');
//             this.flag = false;
//           }
//         },error:() => console.log("Error al obtener los datos") }