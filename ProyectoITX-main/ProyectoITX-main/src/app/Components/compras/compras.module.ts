import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { AddCompraComponent } from './add-compra/add-compra.component';
import { CompraComponent } from './compra/compra.component';
import { ComprasRoutingModule } from './compras-routing.module';
import { DetailCompraComponent } from './detail-compra/detail-compra.component';
import { ListComprasComponent } from './list-compras/list-compras.component';
@NgModule({
  declarations: [
    ListComprasComponent,
    DetailCompraComponent,
    AddCompraComponent,
    CompraComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ComprasRoutingModule,
    NgxSpinnerModule,
    ListboxModule,
    AutoCompleteModule,
    ProgressBarModule,
    KeyFilterModule,
    MultiSelectModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    SliderModule,
    ButtonModule,
    BadgeModule,
    TabViewModule,
  ],
  bootstrap: [AddCompraComponent],
})
export class ComprasModule {}
