import { Component, OnInit } from '@angular/core';
import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { Empresa } from 'src/app/Models/Empresa';
import { Proveedor } from 'src/app/Models/proveedor';
import { ProveedorService } from '../../../Services/proveedor.service';
import { UsuarioService } from '../../../Services/usuario.service';

@Component({
  selector: 'app-lista-proveedores',
  templateUrl: './lista-proveedores.component.html',
  styleUrls: ['./lista-proveedores.component.css']
})
export class ListaProveedoresComponent implements OnInit {
  proveedor:Proveedor=new Proveedor()
  displayMaximizable:any;
  arraySelected:any;
  datainicial:any;
  listaProveedores:Proveedor[]=[];
  loading: boolean = true;
  empresa:Empresa=new Empresa();
  constructor(private usuarioService:UsuarioService,private serviceProveedores:ProveedorService) { }

  ngOnInit(): void {
    this.obtenerEmpresa()
  }
  obtenerEmpresa(){
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        this.empresa = data.empresa!;

        console.log(this.empresa);
        this.serviceProveedores.getByEmpresa(this.empresa.idEmpresa).subscribe(data=>{
          console.log(data)
          this.listaProveedores=data
          this.loading=false
        })
      }
    )
  }
  actualizarEstado(mensaje:any){
    this.serviceProveedores.listarporId(mensaje).subscribe(data => {
      this.proveedor=data
      if(this.proveedor.estado==true){
        this.proveedor.estado=false
      }else if(this.proveedor.estado==false){
        this.proveedor.estado=true
      }
      this.serviceProveedores.updateProveedor(this.proveedor,mensaje).subscribe(data => {
      })
    })
  }
  listar(){
    this.serviceProveedores.listarProveedor().subscribe(data=>{
      this.listaProveedores=data
      console.log(this.listaProveedores)
      this.loading=false;
      console.log(data)
      })
  }
  editarProveedor(id:any){
    this.datainicial=id
      this.showMaximizableDialog()
  }
  showMaximizableDialog() {
    this.displayMaximizable = true;
}
extractData(datosTabla:any){
  return datosTabla.map((row:any) => [row.idProveedor,row.nombreProveedor,row.celularProveedor,row.estado]);
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
  pdf.add(new Txt("Reporte Proveedor").bold().italics().alignment('center').end);
  pdf.add(pdf.ln(2))
  pdf.add(new Table([
    ['Codigo','Nombre', 'Contacto', 'Estado'],
    ]).widths(['*','*','*','*']).layout(
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
