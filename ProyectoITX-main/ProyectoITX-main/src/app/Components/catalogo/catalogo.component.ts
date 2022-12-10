import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/Models/Empresa';
import { EmpresaService } from 'src/app/Services/empresa.service';
import { Producto } from '../products/producto';
import { ProductosService } from '../products/productos.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  listaEmpresas: Empresa[] = [];
  responsiveOptions: any = [];

  listaProductos!: Producto[];
  nombreEmpresa: string = '';

  constructor(private productoService: ProductosService, private empresaService: EmpresaService, private router: Router) { }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];

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
      }
    );
  }

  obtenerProductosEmpresa(empresa: Empresa){

    this.nombreEmpresa = empresa.nombre;
    this.productoService.getProductsByEmpresa(empresa.idEmpresa).subscribe(
      data => {
        this.listaProductos = data;
      }
    )
  }

}
