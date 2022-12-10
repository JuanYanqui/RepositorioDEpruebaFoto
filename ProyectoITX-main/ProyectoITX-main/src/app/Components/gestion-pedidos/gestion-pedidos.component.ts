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
import { RowToggler } from 'primeng/table';
import { PropertyRead } from '@angular/compiler';
import { VentaPedido } from 'src/app/Models/venta-pedido';
import { VentaPedidoService } from 'src/app/Services/venta-pedido.service';

@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css']
})
export class GestionPedidosComponent implements OnInit {

  empresa: Empresa = new Empresa;
  listaPedidos: Pedido[] = [];
  loading: boolean = true;
  displayVP: boolean = false;

  pedido: Pedido = new Pedido;
  cedula: any;
  nombre: any;
  fecha: any;

  listaItemsPedido: ItemPedido[] = [];
  opciones: any[] = [{name:'Pendientes', key: 'A'},{name:'Aceptados', key: 'B'},{name:'Rechazados', key: 'C'},{name:'Cancelados', key: 'D'},{name:'Ventas directas', key: 'E'}];
  opcionSelected: any = null;
  fotologoempresa:any

  bandPendientes: boolean = true;
  bandAceptados: boolean = false;
  bandRechazados: boolean = false;
  bandCancelados: boolean = false;

  bandVentasDirectas: boolean = false;

  venta: VentaPedido = new VentaPedido;

  pagos: string[] = [
    'Contado', 'Cheque', 'Tarjeta'
  ];

  bandStock: boolean = true;

  listaVentasDirectas: VentaPedido[] = [];

  constructor(private ventaPedidoService: VentaPedidoService, private productoService: ProductosService, private toastr: ToastrService, private itemPedidoService: ItemPedidoService, private usuarioService: UsuarioService, private pedidoService: PedidoService, private router: Router) { }

  ngOnInit(): void {
    this.opcionSelected = this.opciones[0];
    this.obtenerEmpresa();
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

  obtenerVentasDirectas(){
    this.ventaPedidoService.porEmpresaIsOnline(this.empresa.idEmpresa, false).subscribe(
      data => {
        this.listaVentasDirectas = data;
        console.log(this.listaVentasDirectas);
      }
    )
  }

  obtenerPedidos(empresa: Empresa){
    this.pedidoService.getByEmpresa(empresa.idEmpresa).subscribe(
      data => {
        this.listaPedidos = data;
        this.loading = false;
        console.log(this.listaPedidos);
      }
    )
  }

  verPedido(pedido: Pedido, isonline: boolean, i: number){
    this.pedido = pedido;
    this.venta = new VentaPedido;

    if (isonline){
      this.cedula = pedido.cliente?.usuario?.persona?.cedula;
      this.nombre = pedido.cliente?.usuario?.persona?.nombres + " " + pedido.cliente?.usuario?.persona?.apellidos;
      this.fecha = pedido.fechaPedido;
    }else{
      this.cedula = this.listaVentasDirectas[i].persona?.cedula;
      this.nombre = this.listaVentasDirectas[i].persona?.nombres + " " + this.listaVentasDirectas[i].persona?.apellidos;
      this.fecha = this.listaVentasDirectas[i].fechaVenta;
    }

    

    this.itemPedidoService.getByPedido(pedido.idPedido).subscribe(
      data => {
        this.listaItemsPedido = data;
        this.displayVP = true;
        this.bandStock = true;

        this.calcularValorTotalItems();
        
        this.listaItemsPedido.forEach(item => {
          if (item.unidadTotal! > item.producto?.cantidad!){
            this.bandStock = false;
            console.log('Fuera de stock!');
          }
        });

        if (this.bandAceptados){
          this.ventaPedidoService.porPedido(this.pedido.idPedido).subscribe(
            result => {
              this.venta = result;

            }
          )
        }
      }
    )
  }

  aceptarPedido(){
    this.pedido.revicion = true;
    this.pedido.aceptacion = true;
    this.pedido.fechaRevicion = new Date;

    this.venta.estadoEntrega = false;
    this.venta.estadoVenta = true;
    this.venta.fechaVenta = new Date;

    this.updateProductos();
    this.updatePedidoCreateVenta(this.pedido);
    this.toastr.success('Pedido aceptado!','Exitoso');
    this.displayVP = false;
  }

  rechazarPedido(){
    this.pedido.revicion = true;
    this.pedido.aceptacion = false;
    this.pedido.fechaRevicion = new Date;

    this.venta.estadoEntrega = false;
    this.venta.estadoVenta = false;
    this.venta.fechaVenta = new Date;

    this.updatePedidoCreateVenta(this.pedido);
    this.toastr.warning('Pedido rechazado!','Advertencia');
    this.displayVP = false;
  }

  updatePedidoCreateVenta(pedido: Pedido){
    this.pedidoService.update(pedido, pedido.idPedido).subscribe(
      data => {
        console.log(data);

        this.venta.pedido = data;
        this.venta.empresa = this.empresa;
        this.venta.isOnline = true;
        
        this.ventaPedidoService.post(this.venta).subscribe(
          result =>{
            console.log(result);
            //this.venta = result;
          }
        )
      }
    )
  }

  updateProductos(){
    for (let i = 0; i < this.listaItemsPedido.length; i++) {
      const item = this.listaItemsPedido[i];

      let unidadesItem: any = item.unidadTotal;
      let total: number;

      let producto = {} as Producto;
      producto = this.listaItemsPedido[i].producto!;

      if (this.bandAceptados){
        let reserva: any = producto.cantidad_reserva
        producto.cantidad_reserva = reserva - unidadesItem;

      } else{        
        let cantidadProducto: any = item.producto?.cantidad;
        total = cantidadProducto - unidadesItem;

        producto.cantidad = total;
        producto.cantidad_reserva = unidadesItem;
      }

      console.log(producto);

      this.productoService.updateProduct(producto, producto.id+'').subscribe(
        data => {
          console.log(data);
        }
      )
    }
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

  entregarPedidoVenta(){
    this.venta.estadoEntrega = true;
    this.venta.fechaEntrega = new Date;

    this.updateProductos();

    this.ventaPedidoService.update(this.venta, this.venta.idVentaPedido).subscribe(
      result => {
        console.log(result);
        this.toastr.info('Se ha registrado la entrega del pedido','');
        this.displayVP = false;
      }
    );      
  }

  calcularValorTotalItems(): number{
    let total: any = 0;
    this.listaItemsPedido.forEach(item => {
      total = total + item.subtotal;
    });
    this.venta.valorPagar = total;
    this.venta.valorIva = total * (this.empresa.iva * 0.01);
    this.venta.valorSinIva = total - this.venta.valorIva;

    return total;
  }

  calcularVuelto(){
    this.venta.vuelto = this.venta.valorCaja! - this.venta.valorPagar!;
    if (this.venta.vuelto === NaN){
      this.venta.vuelto = 0;
    }
  }

  filtraLista(){
    switch (this.opcionSelected.key){
      case 'A':
        this.bandPendientes = true;
        this.bandAceptados = false;
        this.bandRechazados = false;
        this.bandCancelados = false;
        this.bandVentasDirectas = false;
      break;
      case 'B':
        this.bandPendientes = false;
        this.bandAceptados = true;
        this.bandRechazados = false;
        this.bandCancelados = false;
        this.bandVentasDirectas = false;
      break;
      case 'C':
        this.bandPendientes = false;
        this.bandAceptados = false;
        this.bandRechazados = true;
        this.bandCancelados = false;
        this.bandVentasDirectas = false;
      break;
      case 'D':
        this.bandPendientes = false;
        this.bandAceptados = false;
        this.bandRechazados = false;
        this.bandCancelados = true;
        this.bandVentasDirectas = false;
      break;
      case 'E':
        this.bandPendientes = false;
        this.bandAceptados = false;
        this.bandRechazados = false;
        this.bandCancelados = false;
        this.bandVentasDirectas = true;
        this.obtenerVentasDirectas();
      break;
    };
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
}
