import { Component, OnInit } from '@angular/core';
import { AddCompraComponent } from '../add-compra/add-compra.component';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'],
})
export class CompraComponent implements OnInit {
  constructor() {}
  indeterminate: string = '';
username = 'Onejohi Tony';
  ngOnInit(): void {}

  onOutletLoaded(component: AddCompraComponent) {
    component.someInput = '87787';
  }

  recieveUsername($event: any) {
    this.username = $event.value;
  }
}
