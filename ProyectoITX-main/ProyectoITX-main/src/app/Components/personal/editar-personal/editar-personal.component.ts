import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Personal } from 'src/app/Models/personal';
import { Persona } from '../../../Models/persona';
import { PersonalCargoService } from '../../../Services/personal-cargo.service';
import { PersonalCargo } from '../../../Models/personal-cargo';
import { Cargo } from 'src/app/Models/cargo';
import { PersonaService } from '../../../Services/persona.service';
import { PersonalService } from '../../../Services/personal.service';
import { Usuario } from '../../../Models/Usuario';
import { UsuarioService } from '../../../Services/usuario.service';
import { SharedServices } from '../../../Services/shared.service';

@Component({
  selector: 'app-editar-personal',
  templateUrl: './editar-personal.component.html',
  styleUrls: ['./editar-personal.component.css']
})
export class EditarPersonalComponent implements OnInit {
  @Input()datainicialPersonal:any;
  @ViewChild('asCedulaCl')
  cedulaCli!: ElementRef;
  @ViewChild('asNombresCl')
  nombresCli!: ElementRef;
  @ViewChild('asApellidoCl')
  apellidoCli!: ElementRef;
  @ViewChild('asCorreoCl')
  correoCli!: ElementRef;
  @ViewChild('asTelefonoCl')
  telefonoCli!: ElementRef;
  @ViewChild('asCelularCl')
  celularCli!: ElementRef;
  @ViewChild('asFechNaci')
  fechaNacimiCli!: ElementRef;
  @ViewChild('asCargo')
  cargo!: ElementRef;
  @ViewChild('asbtnSalario')
  salario!: ElementRef;
  @ViewChild('asbtnVER')
  btnVerProveedor!:ElementRef;
  @ViewChild('asbtnSave')
  btnSavePersonal!:ElementRef;
  @ViewChild('asUsuarioCl')
  txtusuariocl!:ElementRef;
  @ViewChild('ascontraCl')
  txtcotracl!:ElementRef;
  archivos:any;
  mostrarFoto:any;
  nombres:any;
  foto:any;
  image!:any;
  files:any=[];
  file:any='';
  cedula:any;
  bloqueCargo:any=1;
  bloquearSelecCar:any=1;
  textCargo:any;
  listaCargos: Cargo[] = [];
  selectedCargos: Cargo[] = [];
  estadoBtns:any=1;
  estadoPersonal:any;
  personalCarg:PersonalCargo = new PersonalCargo()
  personal:Personal=new Personal();
  persona:Persona = new Persona()
  usuario:Usuario =new Usuario();
  nombresPer:any;
  constructor(private sharedService:SharedServices,private usuarioervice:UsuarioService,private personalSer:PersonalService,private personalService:PersonalCargoService,private personaService:PersonaService) { }

  ngOnInit(): void {
    this.optenerDatos()
    this.obtenerCargos();
  }
  optenerDatos(){
    this.personalService.getPorId(this.datainicialPersonal).subscribe(data=>{
      this.personalCarg=data
      this.persona.idPersona=this.personalCarg.personal?.usuario?.persona?.idPersona
      this.persona.cedula=this.personalCarg.personal?.usuario?.persona?.cedula
      this.persona.nombres=this.personalCarg.personal?.usuario?.persona?.nombres
      this.persona.apellidos=this.personalCarg.personal?.usuario?.persona?.apellidos
      this.persona.correo=this.personalCarg.personal?.usuario?.persona?.correo
      this.persona.telefono=this.personalCarg.personal?.usuario?.persona?.telefono
      this.persona.celular=this.personalCarg.personal?.usuario?.persona?.celular
      this.persona.fechaNacimiento=this.personalCarg.personal?.usuario?.persona?.fechaNacimiento
      this.textCargo=this.personalCarg.cargo?.nombre
      this.foto=this.personalCarg.personal?.fotoPerfil
      console.log(this.foto)
      this.personal.salario=this.personalCarg.personal?.salario
      this.personal.idPersonal=this.personalCarg.personal?.idPersonal;
      this.usuarioervice.getPorId(this.personalCarg.personal?.usuario?.idUsuario).subscribe(dataUSER=>{
        this.usuario=dataUSER
      })
   })
  }
  actualizarprsonal(){
        this.usuario.persona=this.persona
        this.personal.usuario=this.usuario
        this.personalCarg.personal=this.personal
        this.personaService.updatePersona(this.persona,this.persona.idPersona).subscribe(data=>{
             console.log(data)
               this.sharedService.addimage(this.image,'personal').subscribe({
                 next: (img:string) => (this.personal.fotoPerfil=img)
               });
             this.personalSer.updatePersonal(this.personal,this.personal.idPersonal).subscribe(data=>{
               console.log(data)
                this.personalService.update(this.personalCarg,this.personalCarg.idPersonalCargo).subscribe(data=>{
           console.log(data)
           alert("Personl actualizado")
         })
             })
        })
        console.log(this.personalCarg)
        }
  regresarbtn(){
    this.estadoBtns=1
    this.estadoPersonal=1
  }
  editarPersonal(){
    this.bloquearSelecCar=1;
    this.bloqueCargo=0;
    this.estadoBtns=0
    this.estadoPersonal=0
    setTimeout(() => {
      this.optenerDatos()
      const usuaruioCLi = this.txtusuariocl.nativeElement;
      const usupasword = this.txtcotracl.nativeElement;
      usuaruioCLi.disabled = true;
      usupasword.disabled = true;
    }, 100);
  }
  verPersonal(){
    this.bloqueCargo=1;
    this.bloquearSelecCar=0;
    this.estadoBtns=0
    this.estadoPersonal=0
    setTimeout(() => {
      this.optenerDatos()
      const cedulasPersonal = this.cedulaCli.nativeElement;
    const nombresPersonal = this.nombresCli.nativeElement;
    const apellidosPersonal = this.apellidoCli.nativeElement;
    const correosPersonal = this.correoCli.nativeElement;
    const telefonosPerosnal = this.telefonoCli.nativeElement;
    const celularPersonal = this.celularCli.nativeElement;
    const fechaNacimientPerso = this.fechaNacimiCli.nativeElement;
    const cargoPersonal = this.cargo.nativeElement;
    const salarioPersonal = this.salario.nativeElement;
    const savePersonalBTN = this.btnSavePersonal.nativeElement;
    const usuaruioCLi = this.txtusuariocl.nativeElement;
    const usupasword = this.txtcotracl.nativeElement;
    usuaruioCLi.disabled = true;
    usupasword.disabled = true;
      cedulasPersonal.disabled = true;
      nombresPersonal.disabled = true;
      apellidosPersonal.disabled = true;
      correosPersonal.disabled = true;
      telefonosPerosnal.disabled = true;
      fechaNacimientPerso.disabled = true;
      celularPersonal.disabled = true;
      cargoPersonal.disabled = true;
     salarioPersonal.disabled = true;
      savePersonalBTN.style.display = 'none'
    }, 100);
  }
  obtenerCargos(){
    this.personalService.getAll().subscribe(
      data => {
        this.listaCargos = data.map(
          result => {
            var cargo:any = new Cargo;
            cargo.idCargo = result.cargo?.idCargo;
            cargo.descripcion = result.cargo?.descripcion;
            cargo.nombre = result.cargo?.nombre;
            return cargo;
          }
        );
      }
    );
  }
  selectedFile(event:any):void{
    const file = event.target.files[0];
    console.log(file.name);
    this.image = file;
    this.files.push(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (f) => {
      this.foto = reader.result;
      this.file = reader.result;
    };
}
}
