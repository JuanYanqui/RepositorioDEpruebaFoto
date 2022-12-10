import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { NoImageDirective } from 'src/app/Services/no-image.directive';
import { DisponibilidadModule } from '../../Services/pipes/disponibilidad/disponibilidad.module';
import { AddProductComponent } from './add-product/add-product.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { ProductComponent } from './product/product.component';
import { ProductsRoutingModule } from './products-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToolbarModule } from 'primeng/toolbar';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ImageModule } from 'primeng/image';
import { LabelControlDirective } from './add-product/label-control.directive';
@NgModule({
  declarations: [
    ListProductsComponent,
    DetailProductComponent,
    AddProductComponent,
    ProductComponent,
    NoImageDirective,
    LabelControlDirective,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MenubarModule,
    PanelModule,
    InputTextModule,
    ButtonModule, KeyFilterModule,
    PasswordModule,
    FileUploadModule,
    DropdownModule,
    CardModule,
    InputMaskModule,
    TableModule,
    DialogModule,
    DisponibilidadModule,
    DataViewModule,
    RatingModule,
    InputSwitchModule,
    CheckboxModule,
    InputNumberModule,
    ToolbarModule,
    MessageModule,
    ImageModule,
  ],
  bootstrap: [ProductComponent],
})
export class ProductsModule {}
