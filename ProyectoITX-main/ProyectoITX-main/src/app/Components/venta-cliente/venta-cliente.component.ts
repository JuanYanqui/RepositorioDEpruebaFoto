import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/Models/Empresa';
import { ItemPedido } from 'src/app/Models/item-pedido';
import { Persona } from 'src/app/Models/persona';
import { VentaPedido } from 'src/app/Models/venta-pedido';
import { Pedido } from 'src/app/Models/pedido';
import { ItemPedidoService } from 'src/app/Services/item-pedido.service';
import { PedidoService } from 'src/app/Services/pedido.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { VentaPedidoService } from 'src/app/Services/venta-pedido.service';
import { Producto } from '../products/producto';
import { PdfMakeWrapper, Img, Txt, Table, Cell, Canvas, Stack} from 'pdfmake-wrapper';
import { ProductosService } from '../products/productos.service';

@Component({
  selector: 'app-venta-cliente',
  templateUrl: './venta-cliente.component.html',
  styleUrls: ['./venta-cliente.component.css']
})
export class VentaClienteComponent implements OnInit {

  empresa: Empresa = new Empresa;
  listaProductos: Producto[] = [];
  productsSelected: Producto[] = [];

  listaItems: ItemPedido[] = [];

  displayVP: boolean = false;
  bandPedido: boolean = false;
  displayRP: boolean = false;
  displayRC: boolean = false;

  persona: Persona = new Persona;
  venta: VentaPedido = new VentaPedido;
  pedido: Pedido = new Pedido;

  blockSpecial: RegExp = /^[^<>*!]+$/ ///^[^<>*!#@$%^_=+?`\|{}[\]~"'\.\,=0123456789/;:]+$/
  valCorreo: RegExp = /^[^<>*!$%^=\s+?`\|{}[~"']+$/

  generos: string[] = [
    'Masculino', 'Femenino', 'Otro'
  ];

  pagos: string[] = [
    'Contado', 'Cheque', 'Tarjeta'
  ];

  unidad: any;
  precio: any;

  constructor(private itemPedidoService: ItemPedidoService, private pedidoService: PedidoService, private ventaPedidoService: VentaPedidoService, private personaService: PersonaService, private usuarioService: UsuarioService, private productoService: ProductosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerEmpresa();
  }

  obtenerEmpresa(){
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        this.empresa = data.empresa!;

        this.obtenerProductosEmpresa(this.empresa);

        console.log(this.empresa);
      }
    )
  }

  obtenerProductosEmpresa(empresa: Empresa){
    this.productoService.getProductsByEmpresa(empresa.idEmpresa).subscribe(
      data => {
        this.listaProductos = data;
        console.log(this.listaProductos);
      }
    )
  }

  buscarCedula(){
    if (this.persona.cedula != '' && this.persona.cedula != null){
      this.personaService.getPorCedula(this.persona.cedula).subscribe(
        data => {
          if (data!=null){
            this.persona = data;
            this.bandPedido = true;
          }else{
            this.toastr.error('Cedula no registrada!');
            this.bandPedido = false;
          }
        }
      )
    }else{
      this.bandPedido = false;
      this.toastr.error('Ingrese la cedula','');
    }
  }

  registrarPersona(){
    if (!this.bandPedido){
      if (this.persona.apellidos != '' && this.persona.cedula != '' && this.persona.celular != '' && this.persona.correo != '' &&
          this.persona.direccion != '' && this.persona.genero != '' && this.persona.nombres != '' && this.persona.telefono != ''){
        this.personaService.postPersona(this.persona).subscribe(
          data => {
            console.log(data);
            this.toastr.success('Persona registrada correctamente!');
            this.bandPedido = true;
            this.displayRP = false;
          }
        );
      }else{
        this.toastr.error('El formulario contiene campos incorrectos!','');
      }
    }
  }

  verPedido(){
    if(this.productsSelected.length > 0 && this.bandPedido){
      this.listaItems = [];
      this.productsSelected.forEach(product => {
        let itemPedido: ItemPedido = new ItemPedido;
        itemPedido.producto = product;
        itemPedido.precio = itemPedido.producto?.precio_venta;
        itemPedido.cantidad = 0;
        itemPedido.valUnidad = 1;
        this.listaItems.push(itemPedido);
      });
      this.displayVP = true;
      this.precio = '';
      this.unidad = '';
    }
  }

  abrirRegistro(){
    this.displayRP = true;
    this.persona.apellidos = '';
    this.persona.celular = '';
    this.persona.correo = '';
    this.persona.direccion = '';
    this.persona.fechaNacimiento = new Date;
    this.persona.genero = '';
    this.persona.nombres = '';
    this.persona.telefono = '';
  }

  realizarVenta(){
    this.displayVP = false;
    this.displayRC = true;
  }

  calcularValorTotalItems(): number{
    let total: any = 0;
    this.listaItems.forEach(item => {
      let precio: any = item.precio;
      let cantidad: any = item.cantidad;
      let unidades: any = item.valUnidad;
      total = total + ( precio * cantidad * unidades);
    });

    this.venta.valorIva = total * (this.empresa.iva * 0.01);
    this.venta.valorSinIva = total - this.venta.valorIva;
    this.venta.valorPagar = total;
    return total;
  }

  obtenerDisponibilidad(cantidadProducto: number, cantidadItem: number): String{
    let estado: String = '';

    if (cantidadItem > cantidadProducto){
      estado = 'FUERA DE STOCK';
    }else{
      estado = 'EN STOCK';
    }

    return estado;
  }

  calcularVuelto(){
    this.venta.vuelto = this.venta.valorCaja! - this.venta.valorPagar!;
    if (this.venta.vuelto === NaN){
      this.venta.vuelto = 0;
    }
  }

  vender(){
    if (this.listaItems.length > 0){

      this.pedido.aceptacion = true;
      this.pedido.fechaPedido = new Date;
      this.pedido.fechaRevicion = new Date;
      this.pedido.revicion = true;

      this.pedidoService.post(this.pedido).subscribe(
        data => {
          this.pedido = data;

          this.listaItems.forEach(item => {
            let cantidad: any = item.unidadTotal;
            let precio: any = item.precio;
            item.subtotal = cantidad * precio;
            item.pedido = this.pedido;
            this.itemPedidoService.post(item).subscribe(
              result => {
                console.log(result);
              }
            )
          });

          this.venta.estadoEntrega = true;
          this.venta.estadoVenta = true;
          this.venta.fechaEntrega = new Date;
          this.venta.fechaVenta = new Date;
          this.venta.pedido = this.pedido;
          this.venta.persona = this.persona;
          this.venta.empresa = this.empresa;
          this.venta.isOnline = false;

          this.ventaPedidoService.post(this.venta).subscribe(
            result => {
              console.log('venta:');
              console.log(result);
              this.displayRC = false;
              this.limpiar();
              this.toastr.success('Venta registrada correctamente!');
            }
          );
        }
      );
    }
    this.generarPDF()
  }

  cambioUnidad(i: number, unidades: Array<any>){

    if (this.unidad != undefined){
      this.listaItems[i].tipoUnidad = this.unidad.nombre;
      this.listaItems[i].valUnidad = 1;

      let bandUnidad: boolean = true;
      let index: number = 0;

      do{
        if (unidades[index].nombre === this.unidad.nombre){
          bandUnidad = false;
        }
        index++;
      }while(bandUnidad)

      for (let j = 0; j < index; j++) {
        const element = unidades[j];
        let unidadTotal: any = this.listaItems[i].valUnidad;
        this.listaItems[i].valUnidad = unidadTotal * element.valor_equivalencia;
        console.log(element.nombre);
      }

      console.log('TOTAL '+this.listaItems[i].valUnidad);

    }
  }

  cambioPrecio(i: number){

    if (this.precio != undefined){
      this.listaItems[i].tipoPrecio = this.precio.precio;
      this.listaItems[i].precio = this.precio.valor;

      console.log(this.listaItems[i].tipoPrecio + ' ' + this.listaItems[i].precio);
    }
  }

  calcularUnidadTotal(i: number, cantidad: number, valUnidad: number){
    this.listaItems[i].unidadTotal = cantidad * valUnidad;
    console.log(this.listaItems[i].unidadTotal);
  }

  limpiar(){
    this.listaItems = [];
    this.productsSelected = [];

    this.persona = new Persona;
    this.pedido = new Pedido;
    this.venta = new VentaPedido;

    this.bandPedido = false;
  }
  async generarPDF(){
    var totalpedido = this.calcularValorTotalItems();
    const pdf = new PdfMakeWrapper();
    pdf.pageOrientation('portrait')
    pdf.pageSize('A4')
    pdf.add(new Txt("Factura").bold().italics().alignment('left').end);
    //pdf.add(await new Img(imageData).build());
    pdf.add(pdf.ln(3))
    pdf.add(new Txt(this.empresa.nombre).bold().italics().alignment('center').end);
    pdf.add(pdf.ln(1))
    pdf.add(new Stack([ this.empresa.ruc, this.empresa.celular+' '+this.empresa.telefono, this.empresa.correo, this.empresa.direccion ]).alignment('center').end)
    pdf.add(pdf.ln(1))
  pdf.add(pdf.ln(0.5))
  pdf.add(new Table([
    [ 'Cedula: ',this.persona?.cedula]
]).widths([ 50,'*']).end)
pdf.add(new Table([
  [ "Nombres: ",this.persona?.nombres+" "+this.persona?.apellidos]
]).widths([ 50,'*']).end)
pdf.add(new Table([
  [ "Contacto: ",this.persona?.celular,'Correo: ',this.persona?.correo]
]).widths([ 50,'*',50,'*']).end)
pdf.add(pdf.ln(0.1))
pdf.add(new Table([
  [ "Direccion: ",this.persona?.direccion]
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
      ...this.extractData(this.listaItems)
    ]).widths('*').end)
    pdf.add(new Table([
      ['Total','','$ '+(totalpedido*100)/100],
    ]).widths([40,'*',100]).layout(
      {
       fillColor:(rowIndex?:number, node?:any, columnIndex?:number)=>{
      return rowIndex === 0 ? '#CCCCCC': '';
    }}).end)
    //pdf.add(await new Img(this.fotologoempresa+"").build());
    pdf.create().open();
  }
  extractData(datosTabla:any){
    return datosTabla.map((row:any) =>[row.producto?.nombre,"$"+row.precio,row.cantidad+" "+row.tipoUnidad,"$"+((row.precio * row.unidadTotal)*100)/100]);
  }
}
