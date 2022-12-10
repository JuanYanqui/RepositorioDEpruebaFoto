import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Persona } from 'src/app/Models/persona';
import { Usuario } from 'src/app/Models/Usuario';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {

  listaUsuarios: Usuario[] = [];

  loading: boolean = true;

  displayEU: boolean = false;

  genero: any;

  persona: Persona = new Persona;
  usuario: Usuario = new Usuario;

  blockSpecial: RegExp = /^[^<>*!]+$/ ///^[^<>*!#@$%^_=+?`\|{}[\]~"'\.\,=0123456789/;:]+$/
  valCorreo: RegExp = /^[^<>*!$%^=\s+?`\|{}[~"']+$/

  icnActivo: String = "pi pi-check";
  icnInactivo: String = "pi pi-times";
 
  generos: string[] = [
    'Masculino', 'Femenino', 'Otro'
  ];

  constructor(private toastr: ToastrService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerUsuariosPrivilegios();
  }

  obtenerUsuariosPrivilegios(){
    this.usuarioService.getUsuarios().subscribe(
      data => {
        this.listaUsuarios = data.map(
          result => {
            let usuario = new Usuario;
            usuario.estado = result.estado;
            usuario.empresa = result.empresa;
            usuario.idUsuario = result.idUsuario;
            usuario.password = result.password;
            usuario.persona = result.persona;
            usuario.rol = result.rol;
            usuario.username = result.username;

            return usuario;
          }
        );
        this.loading = false;
      }
    );
  }

  editarUsuario(usuario: Usuario){
    this.displayEU = true;

    this.persona.apellidos = usuario.persona?.apellidos;
    this.persona.nombres = usuario.persona?.nombres;
    this.persona.celular = usuario.persona?.celular;
    this.persona.correo = usuario.persona?.correo;
    this.persona.direccion = usuario.persona?.direccion;
    this.persona.fechaNacimiento = usuario.persona?.fechaNacimiento;
    this.persona.genero = usuario.persona?.genero;
    this.persona.idPersona = usuario.persona?.idPersona;
    this.persona.telefono = usuario.persona?.telefono;
    this.persona.cedula = usuario.persona?.cedula;
    
    this.usuario.empresa = usuario.empresa;
    this.usuario.rol = usuario.rol;
    this.usuario.estado = usuario.estado;
    this.usuario.idUsuario = usuario.idUsuario;
    this.usuario.password = usuario.password;
    this.usuario.username = usuario.username;

  }

  actualizarUsuario(){
    this.personaService.updatePersona(this.persona, this.persona.idPersona).subscribe(
      data => {
        this.persona.idPersona = data.idPersona;
        this.usuario.persona = this.persona;

        this.usuarioService.updateUsuario(this.usuario, this.usuario.idUsuario).subscribe(
          result => {
            console.log(result);
            this.limpiar();
            this.toastr.success('Usuario actualizado correctamente','Exitoso!');

          }
        )
      }
    )
  }

  darBajaUsuario(usuario: Usuario){
    let title = '';

    if (!usuario.estado){
      usuario.estado = false;
      title = 'Deshabilitado!';
    }else {
      usuario.estado = true;
      title = 'Habilitado!';
    }

    this.usuarioService.updateUsuario(usuario, usuario.idUsuario).subscribe(
      data => {
        console.log(data);
        this.toastr.warning('Usuario '+title,'Advertencia!')
        this.limpiar();
      }
    )
  }

  limpiar(){
    this.displayEU = false;
    this.persona = new Persona;
    this.usuario = new Usuario;

    this.loading = true;
    this.listaUsuarios = [];
    this.obtenerUsuariosPrivilegios();
  }

}
