import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../Services/persona.service';
import { PersonalService } from '../../Services/personal.service';
import { Persona } from '../../Models/persona';
import { Personal } from '../../Models/personal';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Empresa } from 'src/app/Models/Empresa';
import { RolesService } from 'src/app/Services/roles.service';
import { Roles } from 'src/app/Models/Roles';
import { CargoService } from 'src/app/Services/cargo.service';
import { PersonalCargoService } from 'src/app/Services/personal-cargo.service';
import { Cargo } from 'src/app/Models/cargo';
import { Usuario } from 'src/app/Models/Usuario';
import { PersonalCargo } from 'src/app/Models/personal-cargo';
import { ToastrService } from 'ngx-toastr';
import { SharedServices } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  persona:Persona=new Persona();
  personal:Personal=new Personal();
  usuario: Usuario=new Usuario();
  personalCargos: PersonalCargo = new PersonalCargo();

  empresa: Empresa = new Empresa;
  rol: Roles = new Roles;

  listaCargos: Cargo[] = [];
  selectedCargos: Cargo[] = [];

  file: any = '';

  files: any = [];
  image!: any;

  archivos:any;
  cedula:any;
  fecaActual:any;
  nombres:any;
  apellidos:any;
  mostrarFoto:any;

  flagPersona: boolean = false;

  constructor(private sharedServices: SharedServices, private toastr: ToastrService, private cargoService: CargoService, private personalCargoService: PersonalCargoService, private rolService: RolesService, private servicePersona:PersonaService, private servicePersonal:PersonalService, private usuarioService: UsuarioService ) { }

  ngOnInit(): void {
    this.obtenerEmpresa();
    this.obtenerRol();
    this.obtenerCargos();

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
    this.rolService.getByName('CLIENTE ADMINISTRADOR').subscribe(
      data => {
        this.rol = data;
      }
    )
  }

  obtenerCargos(){
    this.cargoService.getAll().subscribe(
      data => {
        this.listaCargos = data.map(
          result => {
            let cargo = new Cargo;
            cargo.descripcion = result.descripcion;
            cargo.idCargo = result.idCargo;
            cargo.nombre = result.nombre;

            return cargo;
          }
        );
      }
    );
  }

  buscarPorCedula(){

    if (this.persona.cedula != null && this.persona.cedula != ''){
      this.servicePersona.getPorCedula(this.persona.cedula).subscribe(
        data => {
          console.log(data);
          if (data != null){
            this.flagPersona = false;
            this.persona = data;
          }else{
            this.flagPersona = true;
            this.toastr.info('La cedula ingresada no esta registrada en el sistema','Cedula no encontrada')      
          }
        }
      )
    }else{
      this.toastr.warning('Cedula incorrecta','Advertencia!')
    }
      
  }

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

  crearPersonal(){

    if(this.validarDatos()==0 && this.selectedCargos.length > 0 && this.persona.cedula?.length === 10 && this.usuario.username != undefined && this.usuario.username != ''){

      this.usuarioService.verfUsername(this.usuario.username).subscribe(
        result => {
          if (result){
            this.toastr.error('El username ya está en uso','Error');
          }else{

            this.fecaActual = new Date();
            this.personal.fechaRegistro = this.fecaActual;
            this.personal.lugarTrabajo = "empresa"
            this.personal.horario = "inicio"
            this.personal.estado = true;

            this.usuario.empresa = this.empresa;
            this.usuario.estado = true;            
            this.usuario.rol = this.rol;

            if (this.flagPersona){        
              this.servicePersona.postPersona(this.persona).subscribe(
                data => {
                  console.log('persona '+data);                  
                  this.usuario.persona = data;
      
                  this.usuarioService.postUsuario(this.usuario).subscribe(
                    result => {
                      console.log('usuario '+result);
                      this.usuario = result;
      
                      this.personal.usuario = this.usuario;
      
                      this.sharedServices.addimage(this.image,'personal').subscribe({
                        next: (img:string) => (this.personal.fotoPerfil = img),
                        complete: () =>
                          this.servicePersonal.save(this.personal).subscribe(
                            info => {
                              console.log('personal '+info);
                              this.personal = info;
      
                              this.personalCargos.estado = true;
                              this.personalCargos.personal = this.personal;
                              this.selectedCargos.forEach(cargo => {
                                this.personalCargos.cargo = cargo;
      
                                this.personalCargoService.post(this.personalCargos).subscribe(
                                  data => {
                                    console.log('personalCargo: '+data);
                                    this.toastr.success('Personal agregado correctamente','Registrado!');
                                    this.clean();
                                  }
                                );
                              });
                            }
                          ),
                      });
                    }
                  );
                }
              );
                  
            }else{                     
              
              this.usuario.persona = this.persona;
      
              this.usuarioService.postUsuario(this.usuario).subscribe(
                result => {
                  console.log('usuario '+result);
                  this.usuario = result;
      
                  this.personal.usuario = this.usuario;
      
                  this.sharedServices.addimage(this.image,'personal').subscribe({
                    next: (img:string) => (this.personal.fotoPerfil = img),
                    complete: () =>
                      this.servicePersonal.save(this.personal).subscribe(
                        info => {
                          console.log('personal '+info);
                          this.personal = info;
      
                          this.personalCargos.estado = true;
                          this.personalCargos.personal = this.personal;
                          this.selectedCargos.forEach(cargo => {
                            this.personalCargos.cargo = cargo;
      
                            this.personalCargoService.post(this.personalCargos).subscribe(
                              data => {
                                console.log('personalCargo: '+data);
                                this.toastr.success('Personal agregado correctamente','Registrado!');
                                this.clean();
                              }
                            );
                          });
                        }
                      ),
                  });
                }
              );
            }
          }
        }
      );
    }else{
      this.toastr.warning('Verifique los campos del personal','Advertencia!');
    }
  }

  clean(){
    this.personalCargos = new PersonalCargo;
    this.personal = new Personal;
    this.usuario = new Usuario;
    this.persona = new Persona;

    this.selectedCargos = [];
    this.file = '';
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
