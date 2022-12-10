import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/Models/Empresa';
import { ItemPedido } from 'src/app/Models/item-pedido';
import { Pedido } from 'src/app/Models/pedido';
import { ItemPedidoService } from 'src/app/Services/item-pedido.service';
import { PedidoService } from 'src/app/Services/pedido.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Producto } from '../products/producto';
import { ProductosService } from '../products/productos.service';
import { PdfMakeWrapper, Img, Txt, Table, Cell, Canvas, Stack} from 'pdfmake-wrapper';
import { TableModule } from 'primeng/table';
import { RowToggler } from 'primeng/table';
import { PropertyRead } from '@angular/compiler';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  private empresa: Empresa = new Empresa;
  listaPedidos: Pedido[] = [];
  arrayfiltro:Pedido[]=[];
  loading: boolean = true;
  displayVP: boolean = false;

  pedido: Pedido = new Pedido;
  cedula: any;
  nombre: any;
  fecha: any;

  listaItemsPedido: ItemPedido[] = [];
  opciones: any[] = [{name:'Pendientes', key: 'A'},{name:'Aceptados', key: 'B'},{name:'Rechazados', key: 'C'},{name:'Cancelados', key: 'D'},{name:'Todos', key: 'E'}];
  opcionSelected: any = null;
  fotologoempresa:any
  fechaDesde:any;
  fechaHasta:any;
  fechaActual:any;
  arrayFiltroFecha1:any=[]
  arrayFiltroFecha2:any=[]
  activarfiltro:any;
  sumaTotaldeVenta:any;
  pedido2:ItemPedido[] = [];
  totalPedidos:any;
  arraypdf: Pedido[] = [];
  mostarPDF:any
  ocultarrarPDFS:any

  bandPendientes: boolean = true;
  bandAceptados: boolean = false;
  bandRechazados: boolean = false;
  bandCancelados: boolean = false;
  datosprueba:any=[{cedula:'03939203029',nombre:'andres',fecha:"2021-20-10"},
  {cedula:'00119203029',nombre:'andres',fecha:"2021-20-11"},
  {cedula:'02219203029',nombre:'carlos',fecha:"2021-20-12"},
  {cedula:'04449203029',nombre:'maria',fecha:"2021-20-11"},
  {cedula:'12129203029',nombre:'pepe',fecha:"2021-20-12"},
  {cedula:'15155203029',nombre:'el nacho',fecha:"2021-20-13"},
  {cedula:'19282203029',nombre:'la nacha',fecha:"2021-20-13"},
  {cedula:'93283203029',nombre:'los nachitos',fecha:"2021-20-12"},
  {cedula:'99382203029',nombre:'mengele',fecha:"2021-20-11"},]

  constructor(private productoService: ProductosService, private toastr: ToastrService, private itemPedidoService: ItemPedidoService, private usuarioService: UsuarioService, private pedidoService: PedidoService, private router: Router) { }

  ngOnInit(): void {
    this.opcionSelected = this.opciones[0];
    this.obtenerEmpresa();
  }
  mostrar(){
    this.mostarPDF=true
    this.ocultarrarPDFS=false
  }
  ocultar(){
    this.mostarPDF=false
    this.ocultarrarPDFS=true
  }

  obtenerEmpresa(){
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        this.empresa = data.empresa!;
        this.fotologoempresa=this.empresa.logo
        console.log(this.empresa);
        this.obtenerPedidos(this.empresa);
      }
    )
  }
  cargardatos(){
    if(this.activarfiltro==true){
      this.filtroFecha(this.listaPedidos)
    }else{
    this.listaPedidos=[]
    this.obtenerPedidos(this.empresa)
  }
}

  obtenerPedidos(empresa: Empresa){
    this.pedidoService.getByEmpresa(empresa.idEmpresa).subscribe(
      data => {
        this.listaPedidos = data;
        this.loading = false;
        console.log(data)
        this.sumaTOtalVEntas();
      }
    )
  }

  verPedido(pedido: Pedido){
    this.pedido = pedido;

    this.cedula = pedido.cliente?.usuario?.persona?.cedula;
    this.nombre = pedido.cliente?.usuario?.persona?.nombres + " " + pedido.cliente?.usuario?.persona?.apellidos;
    this.fecha = pedido.fechaPedido;

    this.itemPedidoService.getByPedido(pedido.idPedido).subscribe(
      data => {
        this.listaItemsPedido = data;
        this.displayVP = true;
      }
    )
  }

  aceptarPedido(){
    this.pedido.revicion = true;
    this.pedido.aceptacion = true;
    this.pedido.fechaRevicion = new Date;
    this.updateProductos();
    this.updatePedido(this.pedido);
    this.toastr.success('Pedido aceptado!','Exitoso');
    this.displayVP = false;
  }

  updateProductos(){
    for (let i = 0; i < this.listaItemsPedido.length; i++) {
      const item = this.listaItemsPedido[i];

      let cantidadItem: any = item.cantidad;
      let cantidadProducto: any = item.producto?.cantidad;
      let total: number = cantidadProducto - cantidadItem;

      let producto = {} as Producto;
      producto = this.listaItemsPedido[i].producto!;
      producto.cantidad = total;

      this.productoService.updateProduct(producto, producto.id+'').subscribe(
        data => {
          console.log(data);
        }
      )
    }
  }

  rechazarPedido(){
    this.pedido.revicion = true;
    this.pedido.aceptacion = false;
    this.pedido.fechaRevicion = new Date;
    this.updatePedido(this.pedido);
    this.toastr.warning('Pedido rechazado!','Advertencia');
    this.displayVP = false;
  }

  updatePedido(pedido: Pedido){
    this.pedidoService.update(pedido, pedido.idPedido).subscribe(
      data => {
        console.log(data);
      }
    )
  }

  verificarStock(cantidadPedido: number, cantidadTotal: number): string{
    let stock: string = '';

    if (cantidadPedido <= cantidadTotal){
      stock = 'EN STOCK';
    }else{
      stock = 'FUERA DE STOCK';
    }

    return stock;
  }

  verificarPedido(): boolean{
    let val: boolean = false;

    this.listaItemsPedido.forEach(item => {
      let cantidad: any = item.cantidad;
      let total: any = item.producto?.cantidad;

      if (cantidad > total){
        val = true;
      }

    });

    return val;
  }

  entregarPedido(){

    this.updatePedido(this.pedido);
    this.toastr.info('Se ha registrado la entrega del pedido','');
    this.displayVP = false;
  }

  calcularValorTotalItems(): number{
    let total: any = 0;
    this.listaItemsPedido.forEach(item => {
      total = total + item.subtotal;
    });
    return total;
  }
  obtenerPedidosFiltros(){
    this.pedidoService.getByEmpresa(this.empresa.idEmpresa).subscribe(
      data => {
        this.sumaTOtalVEntas();
        if(this.opcionSelected.key=='A'){
          this.arrayfiltro=data
          this.listaPedidos=[]
          for(let i of this.arrayfiltro){
            if(i.aceptacion==false && i.revicion==false){
              this.listaPedidos.push(i)
            }
          }
          this.filtroFecha(this.listaPedidos)
        }else if(this.opcionSelected.key=='B'){
          this.arrayfiltro=data
          this.listaPedidos=[]
          for(let i of this.arrayfiltro){
            if(i.aceptacion==true && i.revicion==true){
              this.listaPedidos.push(i)
            }
          }
          this.filtroFecha(this.listaPedidos)
        }else if(this.opcionSelected.key=='C'){
          this.arrayfiltro=data
          this.listaPedidos=[]
          for(let i of this.arrayfiltro){
            if(i.aceptacion==false && i.revicion==true){
              this.listaPedidos.push(i)
            }
          }
          this.filtroFecha(this.listaPedidos)
        }else if(this.opcionSelected.key=='D'){
          this.arrayfiltro=data
          this.listaPedidos=[]
          for(let i of this.arrayfiltro){
            if(i.aceptacion==true && i.revicion==false){
              this.listaPedidos.push(i)
            }
          }
          this.filtroFecha(this.listaPedidos)
        }else if(this.opcionSelected.key=='E'){
          this.listaPedidos=[]
          this.listaPedidos=data
          this.filtroFecha(this.listaPedidos)
        }
      }
    )
  }
  filtraLista(){
    switch (this.opcionSelected.key){
      case 'A':
        this.bandPendientes = true;
        this.bandAceptados = false;
        this.bandRechazados = false;
        this.bandCancelados = false;
      break;
      case 'B':
        this.bandPendientes = false;
        this.bandAceptados = true;
        this.bandRechazados = false;
        this.bandCancelados = false;
      break;
      case 'C':
        this.bandPendientes = false;
        this.bandAceptados = false;
        this.bandRechazados = true;
        this.bandCancelados = false;
      break;
      case 'D':
        this.bandPendientes = false;
        this.bandAceptados = false;
        this.bandRechazados = false;
        this.bandCancelados = true;
      break;
      case 'E':
        this.bandPendientes = true;
        this.bandAceptados = true;
        this.bandRechazados = true;
        this.bandCancelados = true;
      break;
    };
  }
  filtroFecha(listatabla:any){
    this.listaPedidos=listatabla
    var fechadesde = new Date(this.fechaDesde)
    var fechahasta = new Date(this.fechaHasta)
   // alert(fechadesde+" hasta "+fechahasta)
    if(this.activarfiltro==true){
    this.fechaActual=new Date('yyyy-MM-dd');
    if(this.fechaDesde == null && this.fechaHasta==null ){
       alert("ingrese las fechas corrects")
    }else{
      for(let i of this.listaPedidos){
        if(i.fechaPedido>=this.fechaDesde ){
           this.arrayFiltroFecha1.push(i)
           for(let j of this.arrayFiltroFecha1){
              if(j.fechaPedido<=this.fechaHasta ){
                  this.arrayFiltroFecha2.push(j)
              }
           }
        }
      }
    }
    for(var i = this.arrayFiltroFecha2.length -1; i >=0; i--){
      if(this.arrayFiltroFecha2.indexOf(this.arrayFiltroFecha2[i]) !== i) this.arrayFiltroFecha2.splice(i,1);
    }
    this.listaPedidos=this.arrayFiltroFecha2
    console.log(this.arrayFiltroFecha2)
  if(this.mostarPDF==true){
    this.generarPDFReporte(this.listaPedidos)
    this.listaPedidos=[]
  }
    this.activarfiltro=false
    this.fechaDesde=null
    this.fechaHasta=null
  }else{
    this.obtenerPedidos(this.empresa)
    if(this.mostarPDF==true){
    this.generarPDFReporte(this.listaPedidos)
    this.listaPedidos=[]
  }
  }
  }
  cagardatosfechas(){
    if(this.activarfiltro==true){
      this.filtroFecha(this.listaPedidos)
      this.activarfiltro=false
      this.fechaDesde=null
    this.fechaHasta=null
    }
  }
  sumaTOtalVEntas(){
    this.totalPedidos=this.listaPedidos.length
    this.sumaTotaldeVenta=0
    this.pedidoService.getByEmpresa(this.empresa.idEmpresa).subscribe(data=>{
      for(let i of this.listaPedidos){
        this.itemPedidoService.getByPedido(i.idPedido).subscribe(data2=>{
          this.pedido2=data2
          for(let j of this.pedido2){
            this.sumaTotaldeVenta=this.sumaTotaldeVenta+j.subtotal
          }
        })
      }
    })
  }
  async generarPDF(){
    var totalpedido = this.calcularValorTotalItems();
    const pdf = new PdfMakeWrapper();
    pdf.pageOrientation('portrait')
    pdf.pageSize('A4')
    pdf.add(new Txt("Factura").bold().italics().alignment('left').end);
    pdf.add(new Txt('00-'+this.pedido.idPedido).bold().italics().alignment('right').color('red').end);
    //pdf.add(await new Img(imageData).build());
    pdf.add(pdf.ln(3))
    pdf.add(new Txt(this.empresa.nombre).bold().italics().alignment('center').end);
    pdf.add(pdf.ln(1))
    pdf.add(new Stack([ this.empresa.ruc, this.empresa.celular+' '+this.empresa.telefono, this.empresa.correo, this.empresa.direccion ]).alignment('center').end)
    pdf.add(pdf.ln(1))
    pdf.add(new Table([
      [ 'Fecha: '+this.pedido.fechaPedido]
  ]).widths([ '*']).end)
  pdf.add(pdf.ln(0.5))
  pdf.add(new Table([
    [ 'Cedula: ',this.pedido.cliente?.usuario?.persona?.cedula]
]).widths([ 50,'*']).end)
pdf.add(new Table([
  [ "Nombres: ",this.pedido.cliente?.usuario?.persona?.nombres+" "+this.pedido.cliente?.usuario?.persona?.apellidos]
]).widths([ 50,'*']).end)
pdf.add(new Table([
  [ "Contacto: ",this.pedido.cliente?.usuario?.persona?.celular,'Correo: ',this.pedido.cliente?.usuario?.persona?.correo]
]).widths([ 50,'*',50,'*']).end)
pdf.add(pdf.ln(0.1))
pdf.add(new Table([
  [ "Direccion: ",this.pedido.cliente?.usuario?.persona?.direccion]
]).widths([ 50,'*']).end)
pdf.add(pdf.ln(1))
    pdf.add(new Txt("__________________________________________________________________________________________________").bold().italics().alignment('center').end);
    pdf.add(pdf.ln(1))
    pdf.add(new Table([
      ['Nombre','Precio','Cantidad','Subtotal'],
    ]).widths([ '*','*','*','*']).layout(
      {
       fillColor:(rowIndex?:number, node?:any, columnIndex?:number)=>{
      return rowIndex === 0 ? '#CCCCCC': '';
    }}).end)
    pdf.add(new Table([
      ...this.extractData(this.listaItemsPedido)
    ]).widths('*').end)
    pdf.add(new Table([
      ['Total','','$ '+totalpedido],
    ]).widths([40,'*',100]).layout(
      {
       fillColor:(rowIndex?:number, node?:any, columnIndex?:number)=>{
      return rowIndex === 0 ? '#CCCCCC': '';
    }}).end)
    //pdf.add(await new Img(this.fotologoempresa+"").build());
    pdf.create().open();
  }
  extractData(datosTabla:any){
    return datosTabla.map((row:any) =>[row.producto?.nombre,"$"+row.producto?.precio_venta,row.cantidad,"$"+((row.subtotal)*100)/100]);
  }
  async generarPDFReporte(tablafiltro:any){
    var fechadate=Date();
    const pdf = new PdfMakeWrapper();
    pdf.pageOrientation('portrait')
    pdf.pageSize('A4')
    pdf.add(new Txt("Reporte Ventas").bold().italics().alignment('center').end);
    pdf.add(pdf.ln(2))
    pdf.add(new Txt(this.empresa.nombre).bold().italics().alignment('center').end);
    pdf.add(pdf.ln(1))
pdf.add(pdf.ln(1))
    pdf.add(new Txt("__________________________________________________________________________________________________").bold().italics().alignment('center').end);
    pdf.add(pdf.ln(1))
    pdf.add(new Table([
      ['Cedula','Nombre','Fecha'],
    ]).widths([ '*','*','*']).layout(
      {
       fillColor:(rowIndex?:number, node?:any, columnIndex?:number)=>{
      return rowIndex === 0 ? '#CCCCCC': '';
    }}).end)
    pdf.add(new Table([
      ...this.extractDataReporte(tablafiltro)
    ]).widths('*').end)
    //pdf.add(await new Img(this.fotologoempresa+"").build());
    pdf.create().open();
    this.listaPedidos=[]
  }
  extractDataReporte(datosTabla:any){
    return datosTabla.map((row:any) =>[row.cliente?.usuario?.persona?.cedula,row.cliente?.usuario?.persona?.nombres+" "+row.cliente?.usuario?.persona?.apellidos,row.fechaPedido]);
  }
}
