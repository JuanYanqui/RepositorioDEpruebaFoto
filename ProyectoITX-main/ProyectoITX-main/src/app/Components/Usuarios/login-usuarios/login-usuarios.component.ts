import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/Models/Usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-login-usuarios',
  templateUrl: './login-usuarios.component.html',
  styleUrls: ['./login-usuarios.component.css']
})
export class LoginUsuariosComponent implements OnInit {

  usuario: Usuario = new Usuario;
  tipoUser: any;

  usuarios: any[] = [
    { usu: 'Visita' }, { usu: 'Cliente' }, { usu: 'Empleado de empresa' }, { usu: 'Administrador de empresa' },  { usu: 'Administrador' }, { usu: 'Super administrador' }, 
  ];

  constructor(private toastr:ToastrService, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('idUsuario');
    sessionStorage.removeItem('productosPedido');
  }

  login(){
    this.usuarioService.login(this.usuario.username, this.usuario.password).subscribe(
      data => {
        console.log(data);
        if (data != null){

          if (data.estado){
            this.usuario.idUsuario = data.idUsuario;
            this.toastr.success("Bienvenido "+data.username, "Login");

            localStorage.setItem('idUsuario', String(this.usuario.idUsuario));
            location.replace('/home')
          }else{
            this.toastr.warning("Usuario inhabilitado, no puede ingresar!", "Advertencia!"); 
            this.usuario = new Usuario; 
          }
          
        }else{
          this.toastr.error("USERNAME O PASSWORD INCORRECTOS!", "Login");
          this.usuario = new Usuario;
        
        }
        
      }
    )
  }
  

}
