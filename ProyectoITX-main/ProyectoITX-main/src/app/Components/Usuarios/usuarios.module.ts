import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashUsuarioComponent } from './dash-usuario/dash-usuario.component';
import { FormAdminUserComponent } from './form-admin-user/form-admin-user.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastrModule } from 'ngx-toastr';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { GestionUsuariosComponent } from './gestion-usuarios/gestion-usuarios.component';
import { DialogModule } from 'primeng/dialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToggleButtonModule } from 'primeng/togglebutton';



@NgModule({
  declarations: [
    DashUsuarioComponent,
    FormAdminUserComponent,
    GestionUsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    DialogModule,
    KeyFilterModule,
    ToggleButtonModule
  ]
})
export class UsuariosModule { }
