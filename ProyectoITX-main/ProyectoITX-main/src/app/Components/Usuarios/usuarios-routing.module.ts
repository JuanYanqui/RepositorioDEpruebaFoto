import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VigilanteSuperAdminGuard } from 'src/app/Services/guard/vigilante-super-admin.guard';
import { DashUsuarioComponent } from './dash-usuario/dash-usuario.component';
import { FormAdminUserComponent } from './form-admin-user/form-admin-user.component';
import { GestionUsuariosComponent } from './gestion-usuarios/gestion-usuarios.component';

const routes: Routes = [ {
  path: 'usuarios',
  component: DashUsuarioComponent,
  children: [
    {
      path: '',
      redirectTo: 'gestion',
      pathMatch: 'usuarios',
    },
    {
      path: 'gestion',
      component: GestionUsuariosComponent,
    },
    {
      path: 'agregar',
      component: FormAdminUserComponent,
    },
  ],

  canActivate: [VigilanteSuperAdminGuard]

},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
