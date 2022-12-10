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
import { SharedServices } from 'src/app/Services/shared.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.css']
})
export class RegistroEmpresaComponent implements OnInit {

  empresa: Empresa = new Empresa;
  usuario: Usuario = new Usuario;
  persona: Persona = new Persona;
  rol: Roles = new Roles;

  genero: any;
  provincia: any;
  ciudad: any;

  file: any = '';

  files: any = [];
  image!: any;

  cuentaBancaria: string = '';
  banco: string = '';
  tipo: string = '';
  numero: string = '';

  cuentas: string[] = [];
  fechaNacimiento: Date = new Date;

  provincias: string[] = [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi' , 'Chimborazo', 'Cotopaxi' , 'El Oro' , 'Gallápagos' ,
    'Guayas', 'Imbabura', 'Loja', 'Los Rios', 'Manabí', 'Morona Santiago', 'Napo' , 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas',
    'Sucumbíos', 'Tunguragua', 'Zamora Chinchipe','Otro' 
  ];
  ciudades: string[] = [
    'Cuenca', 'Guaranda' , 'Azogues', 'Tulcán', 'Riobamba', 'Latacunga', 'Machala',
    'Guayaquil', 'Ibarra', 'Loja', 'Babahoyo', 'Portoviejo', 'Macas' , 'Tena', 'Francisco de Orellana', 'Puyo', 'Quito' , 'Santa Elena' , 'Santo Domingo',
    'Nueva Loja', 'Ambato', 'Zamora', 'Otro'
  ];
  generos: string[] = [
    'Masculino', 'Femenino', 'Otro'
  ];

  blockSpecial: RegExp = /^[^<>*!]+$/ ///^[^<>*!#@$%^_=+?`\|{}[\]~"'\.\,=0123456789/;:]+$/
  expCorreo: RegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  valCorreo: boolean = true;
  verfCorreo: string = '';

  constructor(private sharedServices: SharedServices, private toastr: ToastrService, private rolService: RolesService, private empresaService: EmpresaService, private personaService: PersonaService, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.empresa.pais = 'Ecuador';

    this.empresa.acronimo = '';
    this.empresa.ruc = '';
    this.empresa.nombre = '';
    this.empresa.cuentasBancarias = [];

    this.persona.cedula = '';
    this.persona.nombres = '';
    this.persona.apellidos = '';

    this.usuario.username = '';
    this.usuario.password = '';
  }

  validarCorreo(){
    this.valCorreo = this.expCorreo.test(this.empresa.correo!);
    if (this.valCorreo){
      this.verfCorreo='';
      console.log("Correo Bueno");
    }else{
      this.verfCorreo='ng-invalid ng-dirty';
      console.log("Correo malo");
    }
  }

  agregarCuentaBancaria(){
    if (this.banco != '' && this.tipo != '' && this.numero != ''){
      this.cuentaBancaria = 'BANCO/COOPERATIVA: ' + this.banco + ' TIPO DE CUENTA: ' + this.tipo + ' NÚMERO: ' + this.numero;
      this.empresa.cuentasBancarias.push(this.cuentaBancaria);
      this.banco = '';
      this.tipo = '';
      this.numero = '';
    }else{
      this.toastr.warning('Rellene todos los campos de cuenta bancaria', 'Aviso!')
    }
    
  }

  quitarCuentaBancaria(i: any){

    delete this.empresa.cuentasBancarias[i];

    for (let index = 0; index < this.empresa.cuentasBancarias.length; index++) {
      if(this.empresa.cuentasBancarias[index] != null || this.empresa.cuentasBancarias[index] === ''){
        this.cuentas.push(this.empresa.cuentasBancarias[index]);
      }      
    }

    this.empresa.cuentasBancarias = this.cuentas;
  }

  registrarEmpresa(){
    
    this.persona.genero = this.genero.gen;
    this.empresa.provincia = this.provincia.pro;
    this.empresa.ciudad = this.ciudad.ciu;
    this.persona.fechaNacimiento = this.fechaNacimiento;

    if (this.empresa.acronimo === '' || this.empresa.acronimo === null || this.empresa.celular === '' || this.empresa.celular === null || this.empresa.ciudad === '' || this.empresa.ciudad === null || this.empresa.codigoPostal === '' || this.empresa.codigoPostal === null || this.empresa.correo === '' || this.empresa.correo === null || this.empresa.logo === '' || this.empresa.logo === null || this.empresa.mision === '' || this.empresa.mision === null || this.empresa.nombre === '' || this.empresa.nombre === null || this.empresa.pais === '' || this.empresa.pais === null || this.empresa.provincia === '' || this.empresa.provincia === null || this.empresa.rolComercial === '' || this.empresa.rolComercial === null || this.empresa.ruc === '' || this.empresa.ruc === null || this.empresa.telefono === '' || this.empresa.telefono === null || this.empresa.vision === '' || this.empresa.vision === null
    || this.persona.apellidos === '' || this.persona.apellidos === null || this.persona.cedula === '' || this.persona.cedula === null || this.persona.celular === '' || this.persona.celular === null || this.persona.correo === '' || this.persona.correo === null || this.persona.celular === '' || this.persona.celular === null || this.persona.correo === '' || this.persona.correo === null || this.persona.direccion === '' || this.persona.direccion === null || this.persona.genero === '' || this.persona.genero === null || this.persona.nombres === '' || this.persona.nombres === null || this.persona.telefono === '' || this.persona.telefono === null
    || this.usuario.username === '' || this.usuario.username === null ||this.usuario.password === '' || this.usuario.password === null){
      this.toastr.warning('Posee campo/s vacio/s en el formulario!','Alerta');
    }else{
      this.empresaService.verfRuc(this.empresa.ruc).subscribe(
        data => {
          if (!data){
            this.personaService.getPorCedula(this.persona.cedula).subscribe(
              result => {
                if (result === null){
                  this.usuarioService.verfUsername(this.usuario.username).subscribe(
                    data => {
                      if (!data){
                        this.personaService.postPersona(this.persona).subscribe(
                          data => {
                            console.log(data);
                            this.persona.idPersona = data.idPersona;
                            
                            this.empresa.persona = this.persona;
                            this.empresa.logo = this.file;
                            this.empresa.estado = true;
                    
                            this.sharedServices.addimage(this.image,'empresas').subscribe({
                              next: (img:string) => (this.empresa.logo = img),
                              complete: () => 
                              this.empresaService.postEmpresa(this.empresa).subscribe(
                                result => {
                                  console.log(result)
                                  this.toastr.success('Empresa registrada correctamente','Exitoso!') 
                                  this.empresa.idEmpresa = result.idEmpresa;
                      
                                  this.rolService.getByName('CLIENTE ADMINISTRADOR').subscribe(
                                    data => {
                                      this.rol.descripcion = data.descripcion;
                                      this.rol.idRol = data.idRol;
                                      this.rol.nombre = data.nombre;
  
                                      this.usuario.persona = this.persona;
                                      this.usuario.empresa = this.empresa;
                                      this.usuario.rol = this.rol;
                                      this.usuario.estado = true;
  
                                      this.usuarioService.postUsuario(this.usuario).subscribe(
                                        info => {
                                          console.log(info);                                       
                                          this.toastr.success('Usuario registrado correctamente','Exitoso!') 
                                          this.limpiar();
                                        }
                                      );                
                                    }
                                  );                    
                                }
                              ),
                            });                            
                          }
                        );
                      }else{
                        this.toastr.warning("El username ya está en uso", "Advertencia!");
                      }
                    }
                  )
                }else{
                  
                  this.toastr.warning('La cédula ingresada ya está registrada!', 'Advertencia!');
                }
              }
            )
          }else{
            this.toastr.warning("El ruc ya está en uso", "Advertencia!");
          }
        }   
      )
    }
  }

  // onFileSelected(event: any) {
  //   let file = event.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     this.file = reader.result;
  //     this.file = this.file.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  //   };
  // }

  imageSelected(event: any): void {
    const file = event.target.files[0];
    
    console.log(file.name);
    this.image = file;
    this.files.push(file);
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (f) => {
      this.file = reader.result;
    };
  }

  limpiar(){
    this.empresa = new Empresa;
    this.persona = new Persona;
    this.usuario = new Usuario;
    this.rol = new Roles;

    this.file = '';
    this.empresa.cuentasBancarias = [];
    this.cuentas = [];

    this.ciudad = '';
    this.banco = '';
    this.tipo = '';
    this.numero = '';
  }

}
