import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashEmpresaComponent } from './dash-empresa/dash-empresa.component';
import { RegistroEmpresaComponent } from './registro-empresa/registro-empresa.component';
import { GestionEmpresasComponent } from './gestion-empresas/gestion-empresas.component';
import { EmpresaRoutingModule } from './empresa-routing.module';
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
import { DialogModule } from 'primeng/dialog';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ToggleButtonModule} from 'primeng/togglebutton';


@NgModule({
  declarations: [
    DashEmpresaComponent,
    RegistroEmpresaComponent,
    GestionEmpresasComponent,
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
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
export class EmpresaModule { }
