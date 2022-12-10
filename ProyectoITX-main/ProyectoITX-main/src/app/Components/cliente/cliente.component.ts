import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/Models/persona';
import { Clientes } from '../../Models/clientes';
import { PersonaService } from '../../Services/persona.service';
import { ClientesService } from '../../Services/clientes.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Empresa } from 'src/app/Models/Empresa';
import { RolesService } from 'src/app/Services/roles.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/Models/Usuario';
import { Roles } from 'src/app/Models/Roles';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  clientes:Clientes=new Clientes();
  persona:Persona=new Persona();
  empresa: Empresa = new Empresa;
  usuario: Usuario = new Usuario;
  rol: Roles = new Roles;
  cedula:any;
  nombres:any;
  apellidos:any;
  correo:any;
  telefono:any;
  celular:any;
  direccion:any;
  constructor(private toastr: ToastrService, private rolService: RolesService, private personaService:PersonaService, private clienteService:ClientesService, private usuarioService: UsuarioService) { }
  blockSpecial: RegExp = /^[^<>*!#@$%^_=+?`\|{}[\]~"'\.\,=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQWXYZ/;:]+$/;
  blockCorreo: RegExp = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/;
  fechaActual:any;
  observaciones:any;

  flagpersona!: boolean;

  ngOnInit(): void {
    this.obtenerEmpresa();
    this.obtenerRol();
  }

  obtenerEmpresa(){
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        this.empresa = data.empresa!;

        console.log(this.empresa);
      }
    )
  }

  obtenerRol(){
    this.rolService.getByName('CLIENTE').subscribe(
      data => {
        this.rol = data;
      }
    )
  }

  guardarDatos(){
    if(this.validarDatos()==0 && this.persona.cedula?.length === 10){
      this.fechaActual = new Date()
      this.clientes.fechaRegistro = this.fechaActual;
      this.clientes.estado=true;

      this.usuario.empresa = this.empresa;
      this.usuario.estado = true;
      this.usuario.rol = this.rol;

      if (this.flagpersona){
        //Cuando no se encuentra a la persona por la cedulase la registra
        this.personaService.save(this.persona).subscribe(data=>{
          this.persona=data;
          console.log("Persona registrada");
          this.registraUsuarioCliente(this.persona);
          
        });
      }else{
        //Cuando encuentra a la persona solo obtiene sus datos;
        this.registraUsuarioCliente(this.persona);
      }
    }else{
      this.toastr.warning('Verifique los campos del cliente','Advertencia!')
    }
  }

  registraUsuarioCliente(persona: Persona){
    this.usuario.persona = persona;
          
    this.usuarioService.postUsuario(this.usuario).subscribe(
      result => {
        this.usuario.idUsuario = result.idUsuario;

        this.clientes.usuario = this.usuario;

        this.clienteService.save(this.clientes).subscribe(data=>{
          this.borrarFormulario();
          this.toastr.success('Cliente registrado correctamente','Registro exitoso!');
        });  
      }
    );
  }

  buscarPorCedula(){

    if (this.persona.cedula != null && this.persona.cedula != ''){
      this.personaService.getPorCedula(this.persona.cedula).subscribe(
        data => {
          console.log(data);
          if (data != null){

            this.flagpersona = false;

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
            this.flagpersona = true;

            this.toastr.info('La cedula ingresada no esta registrada en el sistema','Cedula no encontrada')      
          }
        }
      )
    }else{
      this.toastr.warning('Cedula incorrecta','Advertencia!')
    }
      
  }

  borrarFormulario(){
    this.flagpersona = false;
    this.persona = new Persona;
    this.usuario = new Usuario;
    this.clientes = new Clientes;
  }
  validarDatos(){
    let datos=0
    if(this.persona.cedula==null || this.persona.cedula=="" || this.persona.cedula.length<=9){
    this.cedula = 1;
    datos=datos+1;
    }else{
      this.cedula=0;
    }
    if(this.persona.nombres==null || this.persona.cedula=="" || this.persona.nombres.length<=2){
      this.nombres = 1;
      datos=datos+1;
    }else{
      this.nombres=0;
    }
    return datos;
  }
}
