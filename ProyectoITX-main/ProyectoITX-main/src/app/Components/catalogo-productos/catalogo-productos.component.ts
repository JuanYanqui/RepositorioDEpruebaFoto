import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { Empresa } from 'src/app/Models/Empresa';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Producto } from '../products/producto';
import { ProductosService } from '../products/productos.service';

@Component({
  selector: 'app-catalogo-productos',
  templateUrl: './catalogo-productos.component.html',
  styleUrls: ['./catalogo-productos.component.css']
})
export class CatalogoProductosComponent implements OnInit {

  empresa: Empresa = new Empresa;
  listaProductos: Producto[] = [];

  //sortOptions!: SelectItem[];

  sortOrder!: number;

  sortField!: string;

  numItems: number = 0;

  constructor(private router: Router, private toastr: ToastrService, private productoService: ProductosService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.obtenerEmpresa();
    // this.sortOptions = [
    //   {label: 'Price High to Low', value: '!price'},
    //   {label: 'Price Low to High', value: 'price'}
    // ];
    this.evitarRepetido(1);
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
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

  agregarAlPedido(producto: Producto){
    let items: string [] = [];
    let idProductos: any = '';
    
    idProductos = sessionStorage.getItem('productosPedido');

    if (idProductos != '' && idProductos != null){
      items = idProductos.split(',');
    }    

    if (this.evitarRepetido(producto.id)){
      this.toastr.warning('El producto ya esta agregado','Advertencia!');
    }else{
      items.push(producto.id+'');
      this.toastr.success('Producto agregado al pedido','Exitoso!')
    }

    idProductos = '';

    for (let i = 0; i < items.length; i++) {
      const element = items[i];

      if (i === (items.length - 1)){
        idProductos += element;
      }else{
        idProductos += element+',';
      }
      
    }
    this.numItems = items.length;
    sessionStorage.setItem('productosPedido',idProductos);
    console.log(sessionStorage.getItem('productosPedido'));
  }

  evitarRepetido(id: any): boolean{
    let resp: boolean = false;
    let items: string [] = [];
    let idProductos: any = '';
    
    idProductos = sessionStorage.getItem('productosPedido');

    if (idProductos != '' && idProductos != null){
      items = idProductos.split(',');
    }

    let i: number = 0;
    while(!resp && items.length > i){
      const item = items[i];
      
      if (id+'' === item){
        resp = true;
      }

      console.log('i '+i);
      i++;
    }

    this.numItems = items.length;
    return resp;
  }

  verPedido(){
    this.router.navigate(['/mi-pedido']);
  }

  vaciarPedido(){
    sessionStorage.removeItem('productosPedido');
    this.numItems = 0;
  }
}
