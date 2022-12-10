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
  selector: 'app-gestion-empresas',
  templateUrl: './gestion-empresas.component.html',
  styleUrls: ['./gestion-empresas.component.css']
})
export class GestionEmpresasComponent implements OnInit {

  empresa: Empresa = new Empresa;
  persona: Persona = new Persona;
  usuario: Usuario = new Usuario;

  rol: Roles = new Roles;

  listaEmpresas: Empresa[] = [];

  loading: boolean = true;

  displayEE: boolean = false;

  genero: any;
  provincia: any;
  ciudad: any;

  file: any = '';

  files: any = [];
  image!: any;

  actualizaImagen: boolean = false;

  cuentaBancaria: string = '';
  banco: string = '';
  tipo: string = '';
  numero: string = '';

  cuentas: string[] = [];
  fechaNacimiento: Date = new Date;

  provincias: any[] = [
    { pro: 'Azuay' }, { pro: 'Bolívar' }, { pro: 'Cañar' }, { pro: 'Carchi' }, { pro: 'Chimborazo' }, { pro: 'Cotopaxi' }, { pro: 'El Oro' }, { pro: 'Gallápagos' },
    { pro: 'Guayas' }, { pro: 'Imbabura' }, { pro: 'Loja' }, { pro: 'Los Rios' }, { pro: 'Manabí' }, { pro: 'Morona Santiago' }, { pro: 'Napo' }, { pro: 'Orellana' }, { pro: 'Pastaza' }, { pro: 'Pichincha' }, { pro: 'Santa Elena' }, { pro: 'Santo Domingo de los Tsáchilas' },
    { pro: 'Sucumbíos' }, { pro: 'Tunguragua' }, { pro: 'Zamora Chinchipe' }, { pro: 'Otro' }
  ];
  ciudades: any[] = [
    { ciu: 'Cuenca' }, { ciu: 'Guaranda' }, { ciu: 'Azogues' }, { ciu: 'Tulcán' }, { ciu: 'Riobamba' }, { ciu: 'Latacunga' }, { ciu: 'Machala' },
    { ciu: 'Guayaquil' }, { ciu: 'Ibarra' }, { ciu: 'Loja' }, { ciu: 'Babahoyo' }, { ciu: 'Portoviejo' }, { ciu: 'Macas' }, { ciu: 'Tena' }, { ciu: 'Francisco de Orellana' }, { ciu: 'Puyo' }, { ciu: 'Quito' }, { ciu: 'Santa Elena' }, { ciu: 'Santo Domingo' },
    { ciu: 'Nueva Loja' }, { ciu: 'Ambato' }, { ciu: 'Zamora' }, { ciu: 'Otro' }
  ];
  generos: any[] = [
    { gen: 'Masculino' }, { gen: 'Femenino' }, { gen: 'Otro' }
  ];

  blockSpecial: RegExp = /^[^<>*!]+$/ ///^[^<>*!#@$%^_=+?`\|{}[\]~"'\.\,=0123456789/;:]+$/
  valCorreo: RegExp = /^[^<>*!$%^=\s+?`\|{}[~"']+$/

  icnActivo: String = "pi pi-check";
  icnInactivo: String = "pi pi-times";

  constructor(private sharedServices: SharedServices, private toastr: ToastrService, private empresaService: EmpresaService, private personaService: PersonaService, private usuarioService: UsuarioService, private rolService: RolesService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerEmpresas();
  }

  obtenerEmpresas(){
    this.empresaService.getEmpresas().subscribe(
      data => {
        this.listaEmpresas = data.map(
          result => {
            let empresa = new Empresa;
            empresa.acronimo = result.acronimo;
            empresa.celular = result.celular;
            empresa.ciudad = result.ciudad;
            empresa.codigoPostal = result.codigoPostal;
            empresa.correo = result.correo;
            empresa.cuentasBancarias = result.cuentasBancarias;
            empresa.direccion = result.direccion;
            empresa.estado = result.estado;
            empresa.idEmpresa = result.idEmpresa;
            empresa.logo = result.logo;
            empresa.mision = result.mision;
            empresa.nombre = result.nombre;
            empresa.paginaWeb = result.paginaWeb;
            empresa.pais = result.pais;
            empresa.persona = result.persona;
            empresa.provincia = result.provincia;
            empresa.rolComercial = result.rolComercial;
            empresa.ruc = result.ruc;
            empresa.telefono = result.telefono;
            empresa.vision = result.vision;

            return empresa;
          }
        );
        this.loading = false;
      }
    )
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

  // onFileSelected(event: any) {
  //   let file = event.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     this.file = reader.result;
  //     this.file = this.file.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  //   };
  // }

  editarEmpresa(empresa: Empresa){
    this.displayEE = true;

    this.empresa.acronimo = empresa.acronimo;
    this.empresa.celular = empresa.celular;
    this.empresa.ciudad  = empresa.ciudad;
    this.empresa.codigoPostal = empresa.codigoPostal;
    this.empresa.correo = empresa.correo;
    this.empresa.cuentasBancarias = empresa.cuentasBancarias;
    this.empresa.direccion = empresa.direccion;
    this.empresa.estado = empresa.estado;
    this.empresa.idEmpresa = empresa.idEmpresa;
    this.empresa.logo = empresa.logo;
    this.empresa.mision = empresa.mision;
    this.empresa.nombre = empresa.nombre;
    this.empresa.paginaWeb = empresa.paginaWeb;
    this.empresa.pais = empresa.pais;
    this.empresa.persona = empresa.persona;
    this.empresa.provincia = empresa.provincia;
    this.empresa.rolComercial = empresa.rolComercial;
    this.empresa.ruc = empresa.ruc;
    this.empresa.telefono = empresa.telefono;
    this.empresa.vision = empresa.vision;

    this.persona.apellidos = this.empresa.persona?.apellidos;
    this.persona.cedula = this.empresa.persona?.cedula;
    this.persona.celular = this.empresa.persona?.celular;
    this.persona.correo = this.empresa.persona?.correo;
    this.persona.direccion = this.empresa.persona?.direccion;
    this.persona.fechaNacimiento = this.empresa.persona?.fechaNacimiento;
    this.persona.genero = this.empresa.persona?.genero;
    this.persona.idPersona = this.empresa.persona?.idPersona;
    this.persona.nombres = this.empresa.persona?.nombres;
    this.persona.telefono = this.empresa.persona?.telefono;

    this.provincia = this.empresa.provincia;
    this.ciudad = this.empresa.ciudad;

    this.genero = this.persona.genero;
    
  }

  actualizarEmpresa(){
    //this.toastr.warning('Se esta trabajando aun!','Informacion');
    if (this.actualizaImagen){
      this.sharedServices.addimage(this.image,'empresas').subscribe({
        next: (img:string) => (this.empresa.logo = img),
        complete: () =>
        this.updateEmpresa(),  
      });
    }else{
      this.updateEmpresa();
    }     
  }

  updateEmpresa(){
    this.empresaService.updateEmpresa(this.empresa, this.empresa.idEmpresa).subscribe(
      data => {
        console.log(data);
        this.toastr.success('La empresa se actualizo correctamente!','Actualizacion');
        this.limpiar();
      }
    )
  }

  darBajaEmpresa(empresa: Empresa){
    let title = '';

    this.empresa = empresa;

    console.log(this.empresa);

    if (empresa.estado === true){
      this.empresa.estado = true;
      empresa.estado = true;
      title = 'Habilitada!';
    }else {
      this.empresa.estado = false;
      empresa.estado = false;
      title = 'Deshabilitada!';
    }

    this.empresaService.updateEmpresa(this.empresa, this.empresa.idEmpresa).subscribe(
      data => {
        console.log(data);
        this.toastr.warning('Empresa '+title,'Advertencia!')
        this.limpiar();
      }
    )
  }

  imageSelected(event: any): void {
    this.actualizaImagen = true;
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
    this.provincia = '';
    this.ciudad = '';
    this.genero = '';

    this.file = '';
    this.actualizaImagen = false;
    this.displayEE = false;

    this.loading = true;
    this.listaEmpresas = [];
    this.obtenerEmpresas();
  }

}
