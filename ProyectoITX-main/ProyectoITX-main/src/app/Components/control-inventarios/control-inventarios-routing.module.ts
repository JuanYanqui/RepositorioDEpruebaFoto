import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VigilanteClientAdminGuard } from '../../modules/services/guard/vigilante-client-admin.guard';
import { ControlInventariosComponent } from './control-inventarios.component';

const routes: Routes = [
  {
    path: '',
    component: ControlInventariosComponent,
     canActivateChild: [VigilanteClientAdminGuard],
    // children: [...],
    // , canActivate: [VigilanteClientAdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlInventariosRoutingModule { }
