import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Clientes } from 'src/app/Models/clientes';
import { Empresa } from 'src/app/Models/Empresa';
import { ItemPedido } from 'src/app/Models/item-pedido';
import { Pedido } from 'src/app/Models/pedido';
import { Usuario } from 'src/app/Models/Usuario';
import { ClientesService } from 'src/app/Services/clientes.service';
import { ItemPedidoService } from 'src/app/Services/item-pedido.service';
import { PedidoService } from 'src/app/Services/pedido.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Producto } from '../products/producto';
import { ProductosService } from '../products/productos.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  listaItems: ItemPedido[] = [];

  nombreEmpresa: string = 'Probando los pedidos';

  cliente: Clientes = new Clientes;

  pedido: Pedido = new Pedido;

  unidad: any;

  bandDisponibilidad: boolean = false;

  constructor(private usuarioService: UsuarioService, private clienteService: ClientesService, private itemPedidoService: ItemPedidoService, private pedidoService: PedidoService, private toastr: ToastrService, private router: Router, private productoService: ProductosService) { }

  ngOnInit(): void {
    this.obtenerCliente();
    this.obtenerPedido();
  }

  obtenerCliente(){
    let usuario: Usuario = new Usuario;
    let empresa: Empresa = new Empresa;

    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        usuario = data;
        empresa = data.empresa!;

        this.clienteService.getByEmpresaUsuario(usuario.idUsuario, empresa.idEmpresa).subscribe(
          result => {
            console.log(result);
            this.cliente = result;
          }
        )
      }
    )
  }

  obtenerPedido(){
    let items: string[] = [];
    let idProductos: any = '';

    idProductos = sessionStorage.getItem('productosPedido');

    if(idProductos != '' && idProductos != null){
      items = idProductos.split(',');
    }else{
      this.toastr.warning('Aún no se agrego productos al pedido','Advertencia!');
    }

    items.forEach(id => {
      let itemPedido: ItemPedido = new ItemPedido;
      this.productoService.getProductById(id).subscribe(
        data=>{
          let producto: Producto = {} as Producto;
          producto = data;
          itemPedido.producto = producto
          itemPedido.precio = producto.precio_venta;
          console.log('valor pedido '+itemPedido.precio);
      });
      itemPedido.cantidad = 0;
      itemPedido.valUnidad = 1;
      this.listaItems.push(itemPedido);
    });

    console.log('azxa '+this.listaItems);
  }

  realizarPedido(){
    this.listaItems.forEach(item => {
      if (item.unidadTotal! > item.producto?.cantidad!){
        this.bandDisponibilidad = false;
      }
    });

    if (this.bandDisponibilidad){
      this.pedido.cliente = this.cliente;
      this.pedido.revicion = false;
      this.pedido.aceptacion = false;
      this.pedido.fechaPedido = new Date;

      this.pedidoService.post(this.pedido).subscribe(
        data => {
          this.pedido = data;
          console.log(this.pedido);
          for (let i = 0; i < this.listaItems.length; i++) {
            const item = this.listaItems[i];
            let precio: any = item.precio;
            let unidades: any = item.unidadTotal;
            this.listaItems[i].precio = precio;
            this.listaItems[i].subtotal =  unidades * precio;
            this.listaItems[i].pedido = this.pedido;
            console.log(this.listaItems[i]);
            this.itemPedidoService.post(this.listaItems[i]).subscribe(
              result => {
                console.log(result);
              }
            )
          }

          this.toastr.success('Pedido realizado correctamente','Exitoso!');
          sessionStorage.removeItem('productosPedido');
          this.listaItems = [];

        }
      )
    }else{
      this.toastr.warning('Cantidad del producto no disponible');
    }
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
        console.log(element.nombre + ' ' + unidadTotal);
      }

      console.log('TOTAL '+this.listaItems[i].valUnidad);
      
    }
  }

  calcularUnidadTotal(i: number, cantidad: number, valUnidad: number){
    this.listaItems[i].unidadTotal = cantidad * valUnidad;
    console.log(this.listaItems[i].unidadTotal);
  }

  calcularValorTotalItems(): number{
    let total: any = 0;
    this.listaItems.forEach(item => {
      let precio: any = item.precio;
      let cantidad: any = item.cantidad;
      let unidades: any = item.valUnidad;
      total = total + ( precio * cantidad * unidades);
    });
    return total;
  }

  verificarDisponibilidad(cantidadProducto: number, cantidadItem: number){
    console.log('producto: '+cantidadProducto+' item: '+cantidadItem);
    if (cantidadItem != undefined && cantidadItem <= cantidadProducto){
      this.bandDisponibilidad = true;
    }else{
      this.bandDisponibilidad = false;
      this.toastr.warning('Cantidad elegida no disponible!');
    }
  }

  volverCatalogo(){
    this.router.navigate(['/catalogo-productos']);
  }
}
