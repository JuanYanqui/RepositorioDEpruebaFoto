import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../../Services/clientes.service';
import { PersonaService } from '../../../Services/persona.service';
import { Clientes } from '../../../Models/clientes';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Empresa } from 'src/app/Models/Empresa';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/Models/Usuario';
import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {
listaClientes:any=[];
datos:any;
arraySelected:any=[];
loading:any;
displayMaximizable: any;
ocultar:any;
datainicial:any;
clientes:Clientes=new Clientes()
empresa: Empresa = new Empresa;
constructor(private toastr:ToastrService, private root:Router,private serviceClientes:ClientesService, private servicePersonas:PersonaService, private usuarioService: UsuarioService) { }
  ngOnInit(): void {
    this.obtenerEmpresa();

  }
  obtenerEmpresa(){
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        this.empresa = data.empresa!;

        console.log(this.empresa);
        this.listar();
      }
    )
  }
  listar(){
    this.serviceClientes.getByEmpresa(this.empresa.idEmpresa).subscribe(data=>{
      this.listaClientes=data
      console.log(this.listaClientes)
    })
  }
  agregar(){
    this.root.navigate(['clientes'])
  }
  showMaximizableDialog() {
    this.displayMaximizable = true;
}
editar(nombre:any){
  var tipo = "false"
  this.datainicial=[nombre,tipo]
  console.log(this.datainicial)
  this.showMaximizableDialog()
}
ver(nombre:any){
  var tipo = "true"
  this.datainicial=[nombre,tipo]
  console.log(this.datainicial)
  this.showMaximizableDialog()
}
actualizarEstado(mensaje:any){
  let accion: string;
  let usuario: Usuario;
  this.serviceClientes.porId(mensaje).subscribe(data => {
    this.clientes=data
    usuario = this.clientes.usuario!;
    if(this.clientes.estado==true){
      this.clientes.estado=false;
      usuario.estado = false;
      accion = 'Cliente Deshabilitado';
    }else if(this.clientes.estado==false){
      this.clientes.estado=true;
      usuario.estado = true;
      accion = 'Cliente Habilitado';
    }
    console.log(this.clientes)

    this.usuarioService.updateUsuario(usuario, usuario.idUsuario).subscribe(
      result => {
        console.log(result);
        this.serviceClientes.updateclientes(this.clientes,mensaje).subscribe(data => {
          console.log(data)
          this.toastr.warning(accion,'Advertencia!')
          this.listar()
        })
      }
    );
  })
}

extractData(datosTabla:any){
  return datosTabla.map((row:any) => [row.idCliente,row.usuario?.persona?.cedula,row.usuario?.persona?.nombres,row.usuario?.persona?.apellidos,row.estado]);
}
async generaraPDF(){
  if(this.arraySelected<=0){
    alert("Seleccione uno o todos los usuarios para poder generara el pdf")
  }else{
 console.log(this.arraySelected)
  const pdf = new PdfMakeWrapper();
  pdf.pageOrientation('portrait')
  pdf.pageSize('A4')
  pdf.add(pdf.ln(2))
  pdf.add(new Txt("Reporte Clientes").bold().italics().alignment('center').end);
  pdf.add(pdf.ln(2))
  pdf.add(new Table([
    ['Codigo','Cedula','Nombres', 'Apellidos', 'Estado'],
    ]).widths(['*','*','*','*','*']).layout(
      {
        fillColor:(rowIndex?:number, node?:any, columnIndex?:number)=>{
          return rowIndex ===0 ? '#CCCCCC': '';
        }
      }
    ).end)
    pdf.add(new Table([
      ...this.extractData(this.arraySelected)
    ]).widths('*').end)

pdf.create().open();
}}

}
