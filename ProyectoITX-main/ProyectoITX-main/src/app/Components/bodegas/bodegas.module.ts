import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { DisponibilidadModule } from 'src/app/Services/pipes/disponibilidad/disponibilidad.module';
import { AddBodegaComponent } from './add-bodega/add-bodega.component';
import { BodegaComponent } from './bodega/bodega.component';
import { BodegasRoutingModule } from './bodegas-routing.module';
import { DetailBodegaComponent } from './detail-bodega/detail-bodega.component';
import { ListBodegasComponent } from './list-bodegas/list-bodegas.component';
import { CascadeSelectModule } from 'primeng/cascadeselect';

@NgModule({
  declarations: [
    BodegaComponent,
    AddBodegaComponent,
    DetailBodegaComponent,
    ListBodegasComponent,
  ],
  imports: [
    BodegasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxSpinnerModule, CascadeSelectModule,
    MenubarModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    FileUploadModule,
    DropdownModule,
    CardModule,
    InputMaskModule,
    TableModule,
    DialogModule,
    DisponibilidadModule,
  ], bootstrap: [BodegaComponent],
})
export class BodegasModule {}
