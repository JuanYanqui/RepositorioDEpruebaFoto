import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AlertsService } from '@service/alerts';

import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Empresa } from 'src/app/Models/Empresa';
import { UnidadMedida } from 'src/app/Models/mocks/unidadMedida';
import { Proveedor } from 'src/app/Models/proveedor';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { MoocksServices } from '../../../Models/mocks/mock.service';
import { Producto } from '../../products/producto';
import { ProductosService } from '../../products/productos.service';
import { Compra } from '../compra';
import { CompraDetail } from '../compradetail';
import { ComprasService } from '../compras.service';

@Component({
  selector: 'app-add-compra',
  templateUrl: './add-compra.component.html',
  styleUrls: ['./add-compra.component.css'],
})
export class AddCompraComponent implements OnInit, OnDestroy {
  @Input() someInput: any;
  empresa = new Empresa();
  formw = NgForm;

  validPattern = '^(?! )^[A-Za-z0-9 ]+$';
  validNumberPatern = '^[0-9]+([.|,][0-9]+)?$';
  compraForm!: FormGroup;

  unidadMedida$!: Observable<UnidadMedida[]>;
  listProducts: Producto[] = [];
  listProveedores: Proveedor[] = [];
  filteredProducts!: any[];
  listUnidadesMedida!: Observable<UnidadMedida[]>;
  selectedProveedores: Proveedor[]=[];

  listaCompra: Compra[] = [];

  detalleCompra = {} as CompraDetail;

  producto = {} as Producto;
  compra = {} as Compra;

  loading: boolean = false;

  //? Variables de compra
  valorTotal = 0;
  total_productos = 0;
  precio_unitario = 0;
  unidades = 0;
  valor_unidad_equivalencia = 0;
  unidad_selected = -1;
  nombre_unidad_medida!: string;
  total_unidades = 0;
  constructor(
    private productService: ProductosService,
    private alertService: AlertsService,
    private usuariosService: UsuarioService,
    private compraService: ComprasService,
    private formBuilder: FormBuilder
  ) {}

  @Output() usernameEmitter = new EventEmitter<string>();

  ngOnDestroy(): void {
    console.log('Sds');
  }

  somethingChanged(event: any) {
    this.listProveedores = event.proveedores;
    this.listUnidadesMedida = this.getUnidades(event.unidades_medida);
  }
  getUnidades(event: any): Observable<UnidadMedida[]> {
    return of(event);
  }

  filterProduct(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.listProducts.length; i++) {
      let country = this.listProducts[i];
      if (country.nombre.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(country);
      }
    }
    this.filteredProducts = filtered;
  }

  clearList() {
    let i = 0;
    while (i < this.listaCompra.length) {
      this.deleteProduct(this.listaCompra.indexOf(this.listaCompra[i]));
      i++;
    }
  }

  loadFormGroup() {
    this.compraForm = this.formBuilder.group({
      producto: [''],
      cantidad: [
        null,
        [Validators.required, Validators.pattern(this.validNumberPatern),Validators.maxLength(4)],
      ],
      unidad: ['Unidad', Validators.required],
      proveedores: [null, Validators.required],
    });
    this.listProveedores = [];
    this.listUnidadesMedida = new Observable();

    // this.total_productos = 0;
    this.precio_unitario = 0;
    this.unidades = 0;
    this.valor_unidad_equivalencia = 0;
    this.unidad_selected = -1;
  }

  get f() {
    return this.compraForm.controls;
  }

  pedirCompra() {
    if (this.detalleCompra?.compras) {
      this.detalleCompra.estado = 'Pendiente';
      this.detalleCompra.compras = this.listaCompra;
      this.detalleCompra.empresa = this.empresa;

      this.detalleCompra.fecha_pedido = new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000
      );
      this.detalleCompra.valor_total = this.valorTotal;

      this.compraService.addCompra(this.detalleCompra).subscribe({
        complete: () => {
          this.alertService.showSuccess(
            'El pedido se agrego a la lista de espera',
            'Productos pedidos'
          );
          this.loadFormGroup();
          this.listaCompra = [];
            this.detalleCompra = {} as CompraDetail;
        },
        error: () => {
          this.alertService.showError('No se pudo realizar el pedido', 'Error');
        },
      });
    } else {
      this.alertService.showInfo(
        'Ingrese productos a la lista de compra',
        'No hay producto'
      );
    }


  }
  index: any;
  restar(value: number): number {
    return (this.valorTotal -= value);
  }

  precioPorCantidad(cantidad: number, valor_unitario: number): number {
    console.log('precioPorCantidad', valor_unitario * cantidad);
    return valor_unitario * cantidad;
  }

  sumar(valor: number): number {
    return (this.valorTotal += valor);
  }

  returnValorEquivalente() {
    this.listUnidadesMedida.subscribe({
      next: (unidad) => {
        if (this.unidad_selected === -1) {
          this.valor_unidad_equivalencia =
            this.compraForm.value.cantidad *
            this.compraForm.value.producto.precio_compra;
          this.total_unidades = this.compraForm.value.cantidad;
        } else {
          let nombre = unidad[this.unidad_selected].nombre;
          switch (nombre) {
            case this.nombre_unidad_medida:
              let equiv = unidad[this.unidad_selected].equivalencia;
              let valor: any;
              unidad.forEach((up) => {
                valor = unidad.find((up) => {
                  return up.nombre === equiv;
                });
              });
              console.log(
                'valor_equivalencia',
                valor?.valor_equivalencia,
                'equivalencia',
                valor?.equivalencia
              );
              if (valor) {
                if (!unidad[this.unidad_selected + 1]
                  ?.nombre) {
                  let unidadesTotales = 1;
                  unidad.forEach((up) => {
                    unidadesTotales *= up.valor_equivalencia;
                  });
                  this.valor_unidad_equivalencia =
                    this.compraForm.value.cantidad *
                    unidadesTotales *
                    this.compraForm.value.producto.precio_compra;

                  this.total_unidades = unidadesTotales;
                  console.log(unidadesTotales);
                } else {
                  let val = unidad[this.unidad_selected].valor_equivalencia;
                  this.valor_unidad_equivalencia =
                    this.compraForm.value.cantidad *
                    (valor?.valor_equivalencia *
                      val *
                      this.compraForm.value.producto.precio_compra);
                  this.total_unidades =
                    this.compraForm.value.cantidad *
                    (valor?.valor_equivalencia * val);
                }
              } else {
                this.valor_unidad_equivalencia = this.compraForm.value.cantidad * unidad[this.unidad_selected].valor_equivalencia *
                this.compraForm.value.producto.precio_compra;
                this.total_unidades =this.compraForm.value.cantidad * unidad[this.unidad_selected].valor_equivalencia;
              }
              break;
            default:
              break;
          }
        }
      },
    });
    return this.compraForm.value.unidad;
  }

  searchWithCode(ev: any): void {
    this.nombre_unidad_medida = ev.target.value;
    this.unidad_selected = ev.target['selectedIndex'] - 1;
    console.log(this.unidad_selected);
  }
  addProducto(): any {
    this.returnValorEquivalente();

    if (this.compraForm.valid) {
      this.compra = {} as Compra;
      this.producto = this.compraForm.value.producto;
      this.compra.producto = this.producto;
      this.compra.cantidad = this.compraForm.value.cantidad;
      this.compra.cantidad_unitarias = this.total_unidades;
      this.compra.unidad = this.compraForm.value.unidad;

      this.compra.valor_total = this.valor_unidad_equivalencia;
      this.compra.proveedor = this.selectedProveedores[0];
      console.log(this.compra);
      this.listaCompra.push(this.compra);
      if (this.listaCompra.includes(this.compra)) {
        this.detalleCompra.compras = this.listaCompra;
        this.precio_unitario = this.compra.producto.precio_compra;
        this.unidades = this.compra.cantidad_unitarias;

        console.log('Valor total - en suma:', this.valor_unidad_equivalencia);
        console.log(
          'Precio en suma:',
          this.sumar(
            this.precioPorCantidad(this.unidades, this.precio_unitario)
          )
        );

        this.alertService.showSuccess(
          'Producto agregado a la lista',
          'Success'
        );
        this.loadFormGroup();
      } else {
        this.alertService.showWarnig(
          'El producto ya se encuentra en la lista',
          'Producto repetido'
        );
      }
      //    this.compraForm.reset();
    }
  }

  deleteProduct(index: any) {
    const i = this.listaCompra.indexOf(this.listaCompra[index]);
    if (i > -1) {
      this.precio_unitario = this.listaCompra[i].producto.precio_compra;
      this.unidades = this.listaCompra[i].cantidad_unitarias;
      this.restar(this.precioPorCantidad(this.unidades, this.precio_unitario));
      this.listaCompra.splice(i, 1);
    }
    console.log('Valor total - en resta:', this.valorTotal);
  }

  editProduct(index: any) {
    console.log('editaaaaaaar', this.listaCompra[index].producto.nombre);
    this.compraForm.patchValue({
      producto: this.listaCompra[index].producto.nombre,
      cantidad: this.listaCompra[index].cantidad,
    });
    this.compraForm.patchValue({
      cantidad: this.listaCompra[index].cantidad,
    });
    this.compraForm.patchValue({
      unidad: this.listaCompra[index].unidad,
    });

    this.deleteProduct(index);
  }

  ngOnInit(): void {
    this.loadFormGroup();
    this.obtenerEmpresa();
  }

  obtenerEmpresa() {
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuariosService.getPorId(idUsuario).subscribe({
      next: (data) => {
        this.empresa = data.empresa!;
      },
      error: (error) => console.log(error),
      complete: () => this.obtenerProdctos(),
    });
  }

  obtenerProdctos() {
    this.productService
      .getProductsByEmpresa2(this.empresa.idEmpresa)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (producto) => (this.listProducts = producto),
        error: (err) => {
          console.log(err.message);
        },
      });
    this.loading = false;
  }
}