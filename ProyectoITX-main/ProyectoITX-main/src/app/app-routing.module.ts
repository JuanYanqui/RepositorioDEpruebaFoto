import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatalogoComponent } from './Components/catalogo/catalogo.component';
import { ClienteComponent } from './Components/cliente/cliente.component';
import { EditarClientesComponent } from './Components/cliente/editar-clientes/editar-clientes.component';
import { ListaClientesComponent } from './Components/cliente/lista-clientes/lista-clientes.component';
import { HomeComponent } from './Components/home/home.component';
import { EditarPersonalComponent } from './Components/personal/editar-personal/editar-personal.component';
import { ListaPersonalComponent } from './Components/personal/lista-personal/lista-personal.component';
import { PersonalComponent } from './Components/personal/personal.component';
import { EditarProveedorComponent } from './Components/proveedores/editar-proveedor/editar-proveedor.component';
import { ListaProveedoresComponent } from './Components/proveedores/lista-proveedores/lista-proveedores.component';
import { ProveedoresComponent } from './Components/proveedores/proveedores.component';
import { FormPublicUserComponent } from './Components/Usuarios/form-public-user/form-public-user.component';
import { LoginUsuariosComponent } from './Components/Usuarios/login-usuarios/login-usuarios.component';
import { VigilanteClientAdminGuard } from './Services/guard/vigilante-client-admin.guard';
import { CatalogoProductosComponent } from './Components/catalogo-productos/catalogo-productos.component';
import { ConfiguracionesComponent } from './Components/configuraciones/configuraciones.component';
import { PedidoComponent } from './Components/pedido/pedido.component';
import { GestionPedidosComponent } from './Components/gestion-pedidos/gestion-pedidos.component';
import { ClientPedidosComponent } from './Components/client-pedidos/client-pedidos.component';
import { ReportesComponent } from './Components/reportes/reportes.component';
import { VentaClienteComponent } from './Components/venta-cliente/venta-cliente.component';


const routes: Routes = [
  { path: 'add-public-prolife', component: FormPublicUserComponent },
  { path: 'log-in', component: LoginUsuariosComponent,data: { preload: true }},

  { path: 'cliente', component: ClienteComponent },
  { path: 'lista-clientes', component: ListaClientesComponent },
  { path: 'lista-personal', component: ListaPersonalComponent },
  {
    path: 'proveedores',
    canActivate: [VigilanteClientAdminGuard],
    component: ProveedoresComponent,
  },
  { path: 'lista-proveedores', component: ListaProveedoresComponent },
  {
    path: 'editar-cliente',
    canActivate: [VigilanteClientAdminGuard],
    component: EditarClientesComponent,
  },
  {
    path: 'editar-personal',
    canActivate: [VigilanteClientAdminGuard],
    component: EditarPersonalComponent,
  },
  {
    path: 'reportes',
    //canActivate: [VigilanteClientAdminGuard],
    component: ReportesComponent,
  },
  { path: 'configuraciones',
  canActivate: [VigilanteClientAdminGuard],
  component:ConfiguracionesComponent},
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'personal', component: PersonalComponent },
  { path: 'editar-proveedor', component: EditarProveedorComponent },

  { path: 'catalogo-productos', component: CatalogoProductosComponent },
  { path: 'mi-pedido', component: PedidoComponent },
  { path: 'gestion-pedidos', component: GestionPedidosComponent },
  { path: 'client-pedidos', component: ClientPedidosComponent },
  { path: 'venta-client', component: VentaClienteComponent },

  {
    path: '',
    loadChildren: () =>
      import('./Components/Usuarios/usuarios.module').then(
        (m) => m.UsuariosModule
      ),
    data: { preload: true },
  },
  {
    path: 'control-inventario',
    loadChildren: () =>
      import(
        './Components/control-inventarios/control-inventarios.module'
      ).then((m) => m.ControlInventariosModule),
    data: { preload: false },
  },

  {
    path: '',
    loadChildren: () =>
      import('./Components/Empresa/empresa.module').then(
        (m) => m.EmpresaModule
      ),
    data: { preload: true },
  },

  {
    path: 'producto',
    loadChildren: () =>
      import('./Components/products/products.module').then(
        (m) => m.ProductsModule
      ),
    data: { preload: false },
  },
  {
    path: 'compras',
    loadChildren: () =>
      import('./Components/compras/compras.module').then(
        (m) => m.ComprasModule
      ),
    data: { preload: false },
  },
  {
    path: 'bodegas',
    loadChildren: () =>
      import('./Components/bodegas/bodegas.module').then(
        (m) => m.BodegasModule
      ),
    data: { preload: false },
  },
  { path: 'home', component: HomeComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
