import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VigilanteClientAdminGuard } from 'src/app/Services/guard/vigilante-client-admin.guard';
import { AddBodegaComponent } from './add-bodega/add-bodega.component';
import { BodegaComponent } from './bodega/bodega.component';
import { DetailBodegaComponent } from './detail-bodega/detail-bodega.component';
import { ListBodegasComponent } from './list-bodegas/list-bodegas.component';

const routes: Routes = [
  {
    path: '',
    component: BodegaComponent,
    children: [
      {
        path: '',
        redirectTo: 'agregar',
        pathMatch: 'bodegas',
      },
      {
        path: 'listar',
        component: ListBodegasComponent,
      },
      {
        path: 'detalle-bodega',
        component: DetailBodegaComponent,
      },
      {
        path: 'detalle-bodega/:id',
        component: DetailBodegaComponent,
      },
      {
        path: 'agregar',
        component: AddBodegaComponent,
      },
    ],

    // canActivate: [VigilanteClientAdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BodegasRoutingModule {}
