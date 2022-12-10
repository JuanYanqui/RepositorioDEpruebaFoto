import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VigilanteSuperAdminGuard } from 'src/app/Services/guard/vigilante-super-admin.guard';
import { DashEmpresaComponent } from './dash-empresa/dash-empresa.component';
import { GestionEmpresasComponent } from './gestion-empresas/gestion-empresas.component';
import { RegistroEmpresaComponent } from './registro-empresa/registro-empresa.component';

const routes: Routes = [ {
  path: 'empresas',
  component: DashEmpresaComponent,
  children: [
    {
      path: '',
      redirectTo: 'gestion',
      pathMatch: 'empresas',
    },
    {
      path: 'gestion',
      component: GestionEmpresasComponent,
    },
    {
      path: 'agregar',
      component: RegistroEmpresaComponent,
    },
  ],

  canActivate: [VigilanteSuperAdminGuard]

},];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
