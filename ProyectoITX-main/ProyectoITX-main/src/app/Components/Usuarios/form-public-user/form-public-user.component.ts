import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Persona } from 'src/app/Models/persona';
import { Roles } from 'src/app/Models/Roles';
import { Usuario } from 'src/app/Models/Usuario';
import { PersonaService } from 'src/app/Services/persona.service';
import { RolesService } from 'src/app/Services/roles.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-form-public-user',
  templateUrl: './form-public-user.component.html',
  styleUrls: ['./form-public-user.component.css']
})
export class FormPublicUserComponent implements OnInit {

  rol: Roles = new Roles;

  persona: Persona = new Persona;
  usuario: Usuario = new Usuario;

  verfNombres: any;
  verfApellidos: any;
  verfCorreo: any;
  verfUsername: any;
  verfPassword: any;

  expCorreo: RegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  valCorreo: boolean = true;

  constructor(private toastr: ToastrService, private personaService: PersonaService, private usuarioService: UsuarioService, private rolService: RolesService, private router: Router) { }

  ngOnInit(): void {
    this.persona.nombres = '';
    this.persona.apellidos = '';
    this.persona.correo = '';
    this.usuario.username = '';
    this.usuario.password = '';
    localStorage.removeItem('idUsuario');
    sessionStorage.removeItem('productosPedido');
  }

  validarCorreo(){
    this.valCorreo = this.expCorreo.test(this.persona.correo!);
    if (this.valCorreo){
      this.verfCorreo='';
    }else{
      this.verfCorreo='ng-invalid ng-dirty';
    }
  }

  registrarUsuario(){

    if (this.persona.nombres === '' || this.persona.nombres === null){
      this.verfNombres = 'ng-invalid ng-dirty';
      this.toastr.error("Campo nombres vacio!", "Error!");
    }

    if (this.persona.apellidos === '' || this.persona.apellidos === null){
      this.verfApellidos = 'ng-invalid ng-dirty';
      this.toastr.error("Campo apellidos vacio!", "Error!");
    }

    if (this.persona.correo === '' || this.persona.correo === null){
      this.verfCorreo = 'ng-invalid ng-dirty';
      this.toastr.error("Campo correo vacio!", "Error!");
    }

    if (this.usuario.username === '' || this.usuario.username === null){
      this.verfUsername = 'ng-invalid ng-dirty';
      this.toastr.error("Campo username vacio!", "Error!");
    }

    if (this.usuario.password === '' || this.usuario.password === null){
      this.verfPassword = 'ng-invalid ng-dirty';
      this.toastr.error("Campo password vacio!", "Error!");
    }

    if(this.persona.nombres === '' || this.persona.apellidos === '' || this.persona.correo === '' || this.usuario.username === '' || this.usuario.password === ''
      || this.persona.nombres === null || this.persona.apellidos === null || this.persona.correo === null || this.usuario.username === null || this.usuario.password === null || !this.valCorreo){
        
        this.toastr.warning("Verifique que esten correctos los campos")
    }else{
      this.usuarioService.verfUsername(this.usuario.username).subscribe(
        data => {
          if (!data){
            this.personaService.postPersona(this.persona).subscribe(
              data => {
                console.log(data);
                this.persona.idPersona = data.idPersona;
                this.usuario.persona = this.persona;
                this.usuario.estado = true;
        
                this.rolService.getByName('INVITADO').subscribe(
                  data => {
                    console.log(data);
                    this.rol.descripcion = data.descripcion;
                    this.rol.idRol = data.idRol;
                    this.rol.nombre = data.nombre;
            
                    this.usuario.rol = this.rol;
    
                    this.usuarioService.postUsuario(this.usuario).subscribe(
                      result => {
                        console.log(result);
                        this.usuario = result;  
                        localStorage.setItem('idUsuario', String(this.usuario.idUsuario));
                        this.toastr.success('Usuario registrado correctamente','Bienvenido!')          
                        location.replace('/home');
                      }
                    )
                  }
                )                
              }
            )
          } else{
            this.toastr.error("El username que eligio ya está en uso!", "Error");
            this.verfUsername = 'ng-invalid ng-dirty';
            this.usuario.username = '';
          }   
        }     
      )      
    }    
  }

}
