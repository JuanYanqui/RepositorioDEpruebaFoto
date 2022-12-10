import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Clientes } from 'src/app/Models/clientes';
import { Persona } from 'src/app/Models/persona';
import { Usuario } from 'src/app/Models/Usuario';
import { ClientesService } from '../../../Services/clientes.service';
import { Empresa } from '../../../Models/Empresa';
import { style } from '@angular/animations';
import { PersonaService } from 'src/app/Services/persona.service';

@Component({
  selector: 'app-editar-clientes',
  templateUrl: './editar-clientes.component.html',
  styleUrls: ['./editar-clientes.component.css']
})
export class EditarClientesComponent implements OnInit {
  @Input()datainicial:any;
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
  @ViewChild('asDireccionCl')
  direccionCli!: ElementRef;
  @ViewChild('asObservacionCl')
  observacionCli!: ElementRef;
  @ViewChild('asbtnGuardar')
  btnguardarCli!: ElementRef;
  @ViewChild('asbtnVER')
  btnVerProveedor!:ElementRef;
  @ViewChild('asbtnEDITAR')
  btnEditProveedor!:ElementRef;
  @ViewChild('asUsuarioCl')
  txtusuariocl!:ElementRef;
  @ViewChild('ascontraCl')
  txtcotracl!:ElementRef;
  nombres:any
  ocultas:any;
  situeco:any;
  estadoProveedor:any;
  estadoBtns:any=1;
  cedula:any;
  datainicialPersonal:any;
  clientes: Clientes=new Clientes();
  personas: Persona=new Persona();
  usuarios:Usuario=new Usuario();
  empresa:Empresa=new Empresa();
  constructor(private render2:Renderer2,private clienteService:ClientesService,private personaService:PersonaService) { }
  ngOnInit(): void {
  }
  actualizarCliente(){
    this.personaService.updatePersona(this.personas,this.personas.idPersona).subscribe(data=>{
      this.clienteService.updateclientes(this.clientes,this.datainicial[0]).subscribe(data=>{
        alert("Cliente actualizado")
        this.verCliente();
      })
    })
  }
  buscarCliente(){
    this.clienteService.porId(this.datainicial[0]).subscribe(data => {
      this.personas=data.usuario.persona
      this.clientes=data
      this.usuarios=data.usuario
    })
  }
  verCliente(){
    this.estadoBtns=0
    this.estadoProveedor=0
    this.buscarCliente()
    setTimeout(() => {
      const usuaruioCLi = this.txtusuariocl.nativeElement;
      const usupasword = this.txtcotracl.nativeElement;
      const ascedula = this.cedulaCli.nativeElement;
      const asnombres = this.nombresCli.nativeElement;
      const asapellidos = this.apellidoCli.nativeElement;
      const ascorreo = this.correoCli.nativeElement;
      const astelefono = this.telefonoCli.nativeElement;
      const ascelular = this.celularCli.nativeElement;
      const asdireccion = this.direccionCli.nativeElement;
      const asobservacion = this.observacionCli.nativeElement;
      const asbtnGuardar = this.btnguardarCli.nativeElement;
      ascedula.disabled = true;
      usuaruioCLi.disabled = true;
      usupasword.disabled = true;
      asnombres.disabled = true;
      asapellidos.disabled = true;
      ascorreo.disabled = true;
      astelefono.disabled = true;
      ascelular.disabled = true;
      asdireccion.disabled = true;
      asobservacion.disabled = true;
      asbtnGuardar.disabled = true;
      asbtnGuardar.style.display = 'none';
    }, 100);
  }
  editarCliente(){
    this.estadoBtns=0
    this.estadoProveedor=0
    setTimeout(() => {
      this.buscarCliente();
      const usuaruioCLi = this.txtusuariocl.nativeElement;
      const usupasword = this.txtcotracl.nativeElement;
      usuaruioCLi.disabled = true;
      usupasword.disabled = true;
    }, 100);
  }
  regresarbtn(){
    this.estadoBtns=1
    this.estadoProveedor=1
    this.vaciarcampos()
  }
  vaciarcampos(){
    this.personas.nombres=""
    this.personas.apellidos=""
    this.personas.cedula=""
    this.personas.celular=""
    this.personas.correo=""
    this.personas.direccion=""
    this.personas.genero=""
    this.personas.telefono=""
  }
  mostarDatos(idCliente:any){
    this.clienteService.porId(idCliente).subscribe(data => {
      this.personas=data.persona
      this.clientes=data
      this.usuarios=data.usuario
      console.log(this.clientes.usuario?.username)
    //  this.verificarDatos(this.personas.nombres)
    })
  }
  validarDatos(){
    let datos=0
    if(this.personas.cedula==null || this.personas.cedula=="" || this.personas.cedula.length<=9){
    this.cedula = 1;
    datos=datos+1;
    }else{
      this.cedula=0;
    }
    if(this.personas.nombres==null || this.personas.cedula=="" || this.personas.nombres.length<=2){
      this.nombres = 1;
      datos=datos+1;
    }else{
      this.nombres=0;
    }
    return datos;
  }
}
