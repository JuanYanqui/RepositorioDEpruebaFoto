import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/Models/Empresa';
import { Persona } from 'src/app/Models/persona';
import { Roles } from 'src/app/Models/Roles';
import { Usuario } from 'src/app/Models/Usuario';
import { EmpresaService } from 'src/app/Services/empresa.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { RolesService } from 'src/app/Services/roles.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-form-admin-user',
  templateUrl: './form-admin-user.component.html',
  styleUrls: ['./form-admin-user.component.css']
})
export class FormAdminUserComponent implements OnInit {

  persona: Persona = new Persona;
  usuario: Usuario = new Usuario;

  empresa: Empresa = new Empresa;
  rol: Roles = new Roles;

  fechaNacimiento: Date = new Date;

  listaRoles: Roles[] = [];
  listaEmpresas: Empresa[] = [];
  genero: any;

  generos: string[] = [
    'Masculino', 'Femenino', 'Otro'
  ];

  blockSpecial: RegExp = /^[^<>*!]+$/ ///^[^<>*!#@$%^_=+?`\|{}[\]~"'\.\,=0123456789/;:]+$/
  valCorreo: RegExp = /^[^<>*!$%^=\s+?`\|{}[~"']+$/

  flapersona: boolean = true;

  constructor(private toastr: ToastrService, private personaService: PersonaService, private usuarioService: UsuarioService, private rolService: RolesService, private empresaService: EmpresaService, private router: Router) { }

  ngOnInit(): void {
    this.persona.genero = 'Genero';
    this.obtenerRoles();
    this.obtenerEmpresas();
  }

  obtenerRoles(){
    this.rolService.getAll().subscribe(
      data => {
        console.log(data);
        this.listaRoles = data.map(
         result => {
           let rol = new Roles;
           rol.descripcion = result.descripcion;
           rol.idRol = result.idRol;
           rol.nombre = result.nombre;

           return rol;
         } 
        )
      }
    )
  }

  obtenerEmpresas(){
    this.empresaService.getEmpresas().subscribe(
      data => {
        console.log(data);
        this.listaEmpresas = data.map(
          result => {
            let empresa = new Empresa;
            empresa.nombre = result.nombre;
            empresa.idEmpresa = result.idEmpresa;
            empresa.ruc = result.acronimo;

            return empresa;
          }
        )
      }
    )
  }

  buscarPorCedula(){

    if (this.persona.cedula != null && this.persona.cedula != ''){
      this.personaService.getPorCedula(this.persona.cedula).subscribe(
        data => {
          console.log(data);
          if (data != null){

            this.flapersona = false;

            this.persona.apellidos = data.apellidos;
            this.persona.cedula = data.cedula;
            this.persona.celular = data.celular;
            this.persona.correo = data.correo;
            this.persona.direccion = data.direccion;
            this.persona.genero = data.genero;
            this.persona.idPersona = data.idPersona;
            this.persona.nombres = data.nombres;
            this.persona.telefono = data.telefono;
            this.persona.fechaNacimiento = data.fechaNacimiento;
          }else{
            this.flapersona = true;

            this.toastr.info('La cedula ingresada no esta registrada en el sistema','Cedula no encontrada')      
          }
        }
      )
    }else{
      this.toastr.warning('Cedula incorrecta','Advertencia!')
    }
    
  }

  registrarUsuario(){
    
    this.persona.genero = this.genero.gen;

    this.usuario.estado = true;
    this.usuario.empresa = this.empresa;
    this.usuario.rol = this.rol;

    if (this.flapersona){

      this.usuarioService.verfUsername(this.usuario.username).subscribe(
        data => {
          if (!data){
            this.personaService.postPersona(this.persona).subscribe(
              data => {
                this.persona.idPersona = data.idPersona;
      
                this.usuario.persona = this.persona;
      
                this.usuarioService.postUsuario(this.usuario).subscribe(
                  result => {
                    console.log(data);
                    this.toastr.success('Registro de usuario exitoso','Exitoso!');
                  }
                )
      
              }
            )
          }else{
            this.toastr.warning('Este username ya esta en uso', 'Advertencia');
            this.usuario.username = '';
          }
        }
      )
    }else{
      this.usuario.persona = this.persona;
      
      this.usuarioService.postUsuario(this.usuario).subscribe(
        data => {
          console.log(data);
          this.toastr.success('Registro de usuario exitoso','Exitoso!');
        }
      )
    }
  }

}
