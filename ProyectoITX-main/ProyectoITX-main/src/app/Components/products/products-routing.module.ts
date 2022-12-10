import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'producto',
      },

      {
        path: 'listar',
        component: ListProductsComponent,
        data: { animation: 'listar' },
      },
      {
        path: 'detalle-productos',
        component: DetailProductComponent,
      },
      {
        path: 'detalle-producto/:id',
        component: DetailProductComponent,
      },
      {
        path: 'agregar',
        component: AddProductComponent,
        data: { animation: 'listar' },
      },
    ],
    // canActivate: [VigilanteClientAdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
