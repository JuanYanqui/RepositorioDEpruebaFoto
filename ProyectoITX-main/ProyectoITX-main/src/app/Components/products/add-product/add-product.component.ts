import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertsService } from '@service/alerts';
import { HttpClient } from '@angular/common/http';

import { Categoria } from 'src/app/Models/categoria';
import { Proveedor } from 'src/app/Models/proveedor';
import { FotoService } from 'src/app/Services/imagen.service';
import { ProveedorService } from 'src/app/Services/proveedor.service';
import { Empresa } from '../../../Models/Empresa';
import { CategoriaService } from '../../../Services/categoria.service';
import { SharedServices } from '../../../Services/shared.service';
import { UsuarioService } from '../../../Services/usuario.service';
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';
export interface IHash {
  [precio_ventas: string]: number;
}
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  @Input() member: any = '';
  constructor (
    private categoriaServices: CategoriaService,
    private proveedorService: ProveedorService,
    private productoService: ProductosService,
    private sharedServices: SharedServices,
    private usuarioService: UsuarioService,
    private formbuilder2: FormBuilder,
    private formbuilder3: FormBuilder,
    private formbuilder: FormBuilder,
    private alert: AlertsService,
    private fotoService: FotoService,
    private http: HttpClient
  ) {}

  alphanumericPattern = '^(?! )^[A-Za-z0-9 ]+$';
  numbersPattern = '^[0-9]+([.][0-9]+)?$';
  lettersPattern = '^(?! )^[A-Za-z ]+$';
  btnAddPrecios_ventas = false;
  btnAddunidades = false;
  categories: Categoria[] = [];
  proveedors: Proveedor[] = [];
  categoria = new Categoria();
  proveedor = new Proveedor();
  proveedores$!: Proveedor[];
  categorias$!: Categoria[];
  loading: boolean = false;
  productoForm!: FormGroup;
  empresa = new Empresa();
  selectedPrice: any = [];
  selectedUnidad: any = [];
  showMe: boolean = false;
  priceForm!: FormGroup;
  unidadesForm!: FormGroup;
  precios: any[] = [];
  producto!: Producto;
  public data: any;
  file: any = '';
  selectedId = 0;
  image!: any;
  values = [];
  listpreciosventa = Array<any>();
  listUnidadesMedidaProducto = Array<any>();
  current_equivalencia!: string;
  public disabledButton = (): boolean => {
    return false;
  };

  //* Obtener dato especifico de las listas de precio y unidades e venta
  // console.log(this.listpreciosventa[0]['precio']);
  // console.log(this.listUnidadesProducto[0]['nombre']);
  deshabilitarMessage = false;
  selectProveedor(event: any) {
    const index = this.proveedors.indexOf(
      this.proveedores$[event.target.value]
    );
    this.proveedor = this.proveedores$[event.target.value];
    if (index < 0) this.proveedors.push(this.proveedor);
    //   this.productoForm.patchValue({ proveedor: '' });
  }
  selectCategoria(event: any) {
    const index = this.categories.indexOf(this.categorias$[event.target.value]);
    this.categoria = this.categorias$[event.target.value];
    if (index < 0) this.categories.push(this.categoria);
    // this.productoForm.patchValue({ categoria: '' });
  }

  delete(index: any, tipo: string) {
    if (index !== -1) {
      if (tipo == 'p') {
        this.proveedors.splice(index, 1);
        this.productoForm.patchValue({ proveedores: this.proveedores$.indexOf(this.proveedors[this.proveedors.length - 1]) });
      } else {
        this.categories.splice(index, 1);
        this.productoForm.patchValue({ categorias: this.categorias$.indexOf(this.categories[this.categories.length - 1]) });
      }
    }

    if (this.proveedors.length === 0) {
      this.productoForm.patchValue({ proveedores: '' });
    }
    if (this.categories.length === 0) {
      this.productoForm.patchValue({ categorias: '' });
    }
  }

  loadForm() {
    this.productoForm = this.formbuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(this.alphanumericPattern), Validators.maxLength(50)]],
      codigo: ['', [Validators.required, Validators.maxLength(25)]],
      descripcion: ['', Validators.required],
      comentario: [''],
      peso: ['', [Validators.required, Validators.pattern(this.numbersPattern), Validators.maxLength(6)]],
      oferta_descuento: ['', [Validators.pattern(this.numbersPattern), Validators.maxLength(3)]],
      precio_compra: ['', [Validators.required, Validators.pattern(this.numbersPattern), Validators.maxLength(4)]],
      precio_venta: ['', [Validators.required, Validators.pattern(this.numbersPattern), Validators.maxLength(4)]],
      categorias: ['', Validators.required],
      proveedores: ['', Validators.required],
      imagen: [''],
    });
  }

  get formValues() {
    return this.productoForm.controls;
  }

  // imageSelected(event: any): void {
  //   const file = event.target.files[0];
  //   this.image = file;
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //    this.file = reader.result;
  //   };
  // }

  resetRegistro() {
    this.loadForm();
    this.priceForm = this.formbuilder2.group({
      pricesDetails: this.formbuilder2.array([]),
    });
    this.unidadesForm = this.formbuilder3.group({
      unidadesDetails: this.formbuilder3.array([]),
    });
    this.populateData();
    this.showMe = false;
    this.categories = [];
    this.proveedors = [];
    this.file = null;
    // this.productoForm.patchValue({ categoria: '', proveedor: '' });
  }

  sendProduct() {
    this.productoService.addProduct(this.producto).subscribe({
      next: (response) => console.log(response),
      complete: () => {
        this.loading = false;
        this.resetRegistro();
        this.alert.showSuccess('Producto registrado correctamente', 'Registro');
      },
      error: (error: any) => {
        this.alert.showError(error.message, 'Error registro');
        this.loading = false;
      },
    });
  }

  addProducto() {
    console.log('Falta validar?', this.productoForm.valid);
    console.warn('Datos del producto a guardar', this.productoForm.value);

    if (this.productoForm.valid && this.unidadesForm.valid) {
      this.loading = true;
      this.cargarImagen();
      this.priceForm
        .get('pricesDetails')
        ?.value.map((obj: any) => this.listpreciosventa.push(obj));

      this.unidadesForm
        .get('unidadesDetails')
        ?.value.map((obj: any) => this.listUnidadesMedidaProducto.push(obj));

      this.producto = this.productoForm.value;
      this.producto.estado = true;
      this.producto.precio_ventas = this.listpreciosventa;
      this.producto.unidades_medida = this.listUnidadesMedidaProducto;
      this.producto.proveedores = this.proveedors;
      this.producto.categorias = this.categories;
      this.producto.empresa = this.empresa;
      this.producto.imagen = this.nombre_orignal;
      // this.sharedServices.addimage(this.image, 'productos').subscribe({
      //   next: (img: string) => (this.producto.imagen = img),
      //   complete: () => this.sendProduct(),
      //   error: () => (this.loading = false),
      // });

      this.sendProduct();
      
    }
  }

  obtenerEmpresa() {
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe({
      next: (data) => {
        this.empresa = data.empresa!;
      },
      error: (error) => console.log(error),
      complete: () =>
        this.proveedorService
          .getByEmpresa(this.empresa.idEmpresa)
          .subscribe((proveedores) => {
            this.proveedores$ = proveedores;
          }),
    });
  }
  //! ngOnInit///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.obtenerEmpresa();
    this.categoriaServices.getCategorias().subscribe((categorias) => {
      this.categorias$ = categorias;
    });
    this.loadForm();
    this.priceForm = this.formbuilder2.group({
      pricesDetails: this.formbuilder2.array([]),
    });
    this.unidadesForm = this.formbuilder3.group({
      unidadesDetails: this.formbuilder3.array([]),
    });
  }

  //* Agregar precios de venta //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  get pricesDetails(): any {
    return this.priceForm.get('pricesDetails') as FormArray;
  }

  onAdad() {
    this.priceForm.valueChanges.subscribe(() => {
      this.btnAddPrecios_ventas = this.priceForm.invalid || this.formValues.precio_compra.value > this.priceForm.get('pricesDetails')?.value[this.pricesDetails.controls.length - 1]?.valor;
    });
    if (!this.btnAddPrecios_ventas) {
      this.btnAddPrecios_ventas = true;
      this.pricesDetails.push(this.addControls());
    }
  }

  onDelete(index: any) {
    this.btnAddPrecios_ventas = false;
    if (index.length < 1) {
      return;
    }
    this.pricesDetails.controls.splice(index - 1, 1);
  }

  onSubmit() {
    this.data = JSON.stringify(this.pricesDetails.value);
  }

  priceDetailsControls(index: number) {
    // console.log(index);
    return this.pricesDetails.controls[index]['controls'];
  }

  public addControls() {
    return new FormGroup({
      precio: new FormControl('', [
        Validators.required,
        Validators.pattern(this.lettersPattern),
      ]),
      valor: new FormControl('', [
        Validators.pattern(this.numbersPattern),
        Validators.required, Validators.maxLength(4)
      ]),
    });
  }

  private populateData() {
    this.values.forEach((data, index) => {
      this.onAdad();
      this.pricesDetails.controls[index].setValue(data);
    });
  }

  cambio(a: any) {
    this.btnAddPrecios_ventas = false;
    this.priceForm = this.formbuilder2.group({
      pricesDetails: this.formbuilder2.array([]),
    });
  }

  //? Agregar unidades con equivalencias////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get unidadesDetails(): any {
    return this.unidadesForm.get('unidadesDetails') as FormArray;
  }

  onAdad2(valid: boolean, i: any) {
    console.log('indeeeex', i);
    this.unidadesForm.valueChanges.subscribe(() => {
      this.btnAddunidades = this.unidadesForm.invalid;
    });

    if (
      this.unidadesForm.get('unidadesDetails')?.valid &&
      this.productoForm.get('precio_compra')?.valid &&
      !this.btnAddunidades
    ) {
      this.btnAddunidades = false;
      this.unidadesDetails.push(this.addControlsUnidades());
    }
  }

  onDelete2(index: any) {
    if (this.unidadesDetails.controls.length < 2) {
      this.btnAddunidades = false;
      this.unidadesForm = this.formbuilder3.group({
        unidadesDetails: this.formbuilder3.array([]),
      });
      return;
    }
    if (this.unidadesForm.get('unidadesDetails')?.value[index]?.nombre) {
      if (this.unidadesForm.get('unidadesDetails')?.value[index - 1]?.nombre) {
        if (
          this.unidadesForm.get('unidadesDetails')?.value[index - 1]
            ?.equivalencia !=
          this.unidadesForm.get('unidadesDetails')?.value[index - 2]?.nombre
        ) {
          this.unidadesDetails.controls[index].patchValue({
            equivalencia:
              this.unidadesForm.get('unidadesDetails')?.value[index - 1]
                ?.nombre,
          });
        } else {
          if (
            this.unidadesForm.get('unidadesDetails')?.value[index + 1]?.nombre
          ) {
            this.unidadesDetails.controls[index].patchValue({
              equivalencia:
                this.unidadesForm.get('unidadesDetails')?.value[index - 2]
                  ?.nombre,
            });
          } else {
            if (
              this.unidadesForm.get('unidadesDetails')?.value[index + 1]?.nombre
            ) {
              this.unidadesDetails.controls[index].patchValue({
                equivalencia:
                  this.unidadesForm.get('unidadesDetails')?.value[index - 2]
                    ?.nombre,
              });
            }
          }
          this.current_equivalencia =
            this.unidadesForm.get('unidadesDetails')?.value[index - 1]?.nombre;
        }
      }
    } else {
      this.current_equivalencias = 'd';
    }
    this.current_equivalencia = '';

    this.unidadesDetails.controls.splice(index - 1, 1);

  }
  current_equivalencias = '';
  /////////////////////////////////////////////////////
  somethingChanged(event: any) {
    console.log(event.target.value);
  }

  unidadDetailsControls(index: number) {
    return this.unidadesDetails.controls[index]['controls'];
  }

  public addControlsUnidades() {
    this.btnAddunidades = true;

    if (!this.unidadesForm.get('unidadesDetails')?.value[0]?.nombre) {
      this.current_equivalencia = 'Unidad';
    } else {
      if (this.current_equivalencias == 'd') {
        console.log("Rrr")
        this.current_equivalencia =
          this.unidadesForm.get('unidadesDetails')?.value[
            this.unidadesForm.get('unidadesDetails')?.value.length - 1
          ]?.nombre;
      } else {
        if (this.current_equivalencia == '') {
          console.log("Este es")
          this.current_equivalencia =
            this.unidadesForm.get('unidadesDetails')?.value[
              this.unidadesForm.get('unidadesDetails')?.value.length - 1
            ]?.nombre;
        } else {
          console.log("Este")
          this.current_equivalencia =
            this.unidadesForm.get('unidadesDetails')?.value[
              this.unidadesForm.get('unidadesDetails')?.value.length - 1
            ]?.nombre;
        }
      }

    }

    return new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.pattern(this.alphanumericPattern),
      ]),
      equivalencia: new FormControl(this.current_equivalencia, [
        Validators.pattern(this.alphanumericPattern),
        Validators.required,
      ]),
      valor_equivalencia: new FormControl('', [
        Validators.pattern(this.numbersPattern),
        Validators.required, Validators.maxLength(4)
      ]),
    });
  }

  // IMAGEN

  message: string="";
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  // CAPTURO EL ARCHIVO
  nombre_orignal: string="";

  cap_nombre_archivo: any;
  selectedFile!: File;
  public imageSelected(event:any) {
    this.selectedFile = event.target.files[0];

    this.image = this.selectedFile;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
    this.file = reader.result;
    };

    console.log("Seleciono una imagen: " + event.target.value);
    this.cap_nombre_archivo = event.target.value;
    console.log("Numero de datos del nombre del archivo => " + this.cap_nombre_archivo.length)
    this.nombre_orignal = this.cap_nombre_archivo.slice(12);
    console.log("Nombre imagen original => " + this.nombre_orignal);
    console.log(this.nombre_orignal);
    this.producto.imagen = this.nombre_orignal;
    
    //this.verImagen();
  }

  cargarImagen() {
    this.fotoService.onUpload(this.selectedFile);
  }

  // private urlApiFoto: string = 'http://localhost:8080/api/image';
  // verImagen() {
  //   this.http.get(this.urlApiFoto + "/get/" + this.nombre_orignal)
  //     .subscribe(
  //       res => {
  //         this.retrieveResonse = res;
  //         this.base64Data = this.retrieveResonse.picByte;
  //         this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
  //       }
  //     );
  //   //this.fotoService.getImage(this.nombre_orignal);
  // }
}

// https://stackoverflow.com/questions/45225339/angular-4-get-error-message-in-subscribe
// https://www.jsmount.com/how-to-implement-reactive-form-with-prime-ng-table/
