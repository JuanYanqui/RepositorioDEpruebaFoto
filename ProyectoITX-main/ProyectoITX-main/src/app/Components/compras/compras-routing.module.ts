import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VigilanteClientAdminGuard } from 'src/app/Services/guard/vigilante-client-admin.guard';
import { AddCompraComponent } from './add-compra/add-compra.component';
import { CompraComponent } from './compra/compra.component';
import { ListComprasComponent } from './list-compras/list-compras.component';

const routes: Routes = [
  {
    path: '',
    component: CompraComponent,
    children: [
      {
        path: '',
        redirectTo: 'agregar',
        pathMatch: 'compras',
      },
      {
        path: 'listar',
        component: ListComprasComponent,
      },
      {
        path: 'agregar',
        component: AddCompraComponent,
      },
    ],
    canActivate: [VigilanteClientAdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule],
})
export class ComprasRoutingModule {}
