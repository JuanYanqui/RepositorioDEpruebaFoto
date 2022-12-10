import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../Models/Empresa';
import { UsuarioService } from '../../../Services/usuario.service';
import { AddProductComponent } from '../add-product/add-product.component';
import { DetailProductComponent } from '../detail-product/detail-product.component';
import { ListProductsComponent } from '../list-products/list-products.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  constructor(private usuariosService: UsuarioService) {}
    onOutletLoaded(component: AddProductComponent | ListProductsComponent | DetailProductComponent) {

    component.member = Number(this.empresa.idEmpresa);
  }
    empresa = new Empresa();

  obtenerEmpresa() {
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuariosService.getPorId(idUsuario).subscribe((data) => {
      this.empresa = data.empresa!;
    });
  }
    ngOnInit(): void {

        this.obtenerEmpresa()
  }
}
