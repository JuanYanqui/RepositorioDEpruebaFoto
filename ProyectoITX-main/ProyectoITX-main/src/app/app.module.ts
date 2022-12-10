import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenubarModule } from 'primeng/menubar';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogoProductosComponent } from './Components/catalogo-productos/catalogo-productos.component';
import { CatalogoComponent } from './Components/catalogo/catalogo.component';
import { ClienteComponent } from './Components/cliente/cliente.component';
import { EditarClientesComponent } from './Components/cliente/editar-clientes/editar-clientes.component';
import { ListaClientesComponent } from './Components/cliente/lista-clientes/lista-clientes.component';
import { FooterComponent } from './Components/footer/footer.component';
import { EditarPersonalComponent } from './Components/personal/editar-personal/editar-personal.component';
import { ListaPersonalComponent } from './Components/personal/lista-personal/lista-personal.component';
import { PersonalComponent } from './Components/personal/personal.component';
import { EditarProveedorComponent } from './Components/proveedores/editar-proveedor/editar-proveedor.component';
import { ListaProveedoresComponent } from './Components/proveedores/lista-proveedores/lista-proveedores.component';
import { ProveedoresComponent } from './Components/proveedores/proveedores.component';
import { ToolbarComponent } from './Components/toolbar/toolbar.component';
import { FormPublicUserComponent } from './Components/Usuarios/form-public-user/form-public-user.component';
import { LoginUsuariosComponent } from './Components/Usuarios/login-usuarios/login-usuarios.component';
import { InterceptorService } from './Services/interceptor/interceptor.service';
import { ConfiguracionesComponent } from './Components/configuraciones/configuraciones.component';
import { PedidoComponent } from './Components/pedido/pedido.component';
import { ClientPedidosComponent } from './Components/client-pedidos/client-pedidos.component';
import { GestionPedidosComponent } from './Components/gestion-pedidos/gestion-pedidos.component';
import { TooltipModule } from 'primeng/tooltip';
import {TabViewModule} from 'primeng/tabview';
import {RadioButtonModule} from 'primeng/radiobutton';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ReportesComponent } from './Components/reportes/reportes.component';
import { VentaClienteComponent } from './Components/venta-cliente/venta-cliente.component';
PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    AppComponent,
    FormPublicUserComponent,
    LoginUsuariosComponent,
    ClienteComponent,
    ListaClientesComponent,
    ListaPersonalComponent,
    ProveedoresComponent,
    ListaProveedoresComponent,
    EditarClientesComponent,
    EditarPersonalComponent,
    CatalogoComponent,
    PersonalComponent,
    EditarProveedorComponent,
    CatalogoProductosComponent,
    FooterComponent,
    ToolbarComponent,
    ConfiguracionesComponent,
    PedidoComponent,
    ClientPedidosComponent,
    GestionPedidosComponent,
    ReportesComponent,
    VentaClienteComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MenubarModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    FileUploadModule,
    DropdownModule,
    CardModule,
    ToastrModule.forRoot(),
    InputMaskModule,
    TableModule,
    KeyFilterModule,
    ToggleButtonModule,
    CarouselModule,
    MultiSelectModule,
    DataViewModule,
    RatingModule,
    RippleModule,
    VirtualScrollerModule,
    InputNumberModule,
    TooltipModule,
    TabViewModule,
    RadioButtonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
