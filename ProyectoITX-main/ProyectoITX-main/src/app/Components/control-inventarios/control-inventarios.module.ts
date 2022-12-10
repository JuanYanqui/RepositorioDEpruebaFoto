import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ControlInventariosRoutingModule } from './control-inventarios-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ControlInventariosComponent } from './control-inventarios.component';
import { MessagesModule } from 'primeng/messages';
import { BadgeModule } from 'primeng/badge';
import { InputMaskModule } from 'primeng/inputmask';

import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [
    ControlInventariosComponent
  ],
  imports: [ProgressBarModule,
      CommonModule, TableModule, ButtonModule, DropdownModule, FormsModule, DialogModule, ToolbarModule, MessagesModule, BadgeModule,InputMaskModule,
    ControlInventariosRoutingModule
  ]
})
export class ControlInventariosModule { }
