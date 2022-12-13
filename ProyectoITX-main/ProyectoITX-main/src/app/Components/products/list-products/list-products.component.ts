import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { finalize } from 'rxjs/operators';
import { Empresa } from 'src/app/modules/models/Empresa';
import { UsuarioService } from 'src/app/modules/services/usuario.service';
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';
import * as FileSaver from 'file-saver';
import { FotoService } from 'src/app/modules/services/imagen.service';
import { HttpClient } from '@angular/common/http';
declare module 'file-saver';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListProductsComponent implements OnInit {
  @Input() imageLoader: any;
  @Input() member: number = 0;
  producto!: Producto
  image!: any;
  file: any = '';
  loading: boolean = true;
  arraySelected:any;
  empresa = new Empresa();
  arrayExcel:any;
  loaded = false;
  productos: Producto[] = [];
  selectedId = 0;
    showMe!: boolean;

  constructor(
    private usuariosService: UsuarioService,
    public domSanitizer: DomSanitizer,
    private productoService: ProductosService,
    private fotoService: FotoService,
    private http: HttpClient
  ) {}

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
pruebaimg : String="";

  obtenerProdctos() {
    this.productoService
      .getProductsByEmpresa2(this.empresa.idEmpresa)
      .pipe(
        finalize(() => {
          this.loaded = true;
          this.loading = false;
        })
      )
      .subscribe({
        next: (producto) =>
        this.productos = producto, 
        error: (err) => {
          console.log(err.message);
        },
      });
      this. cargar_Datos();
  }

  ngOnInit(): void {
    this.obtenerEmpresa();
    this.verImagen();

  }
  extractData(datosTabla:any){
    console.log(datosTabla)
    return datosTabla.map((row:any) => [row.id||" ",row.id_proveedor||" ",row.nombre||" ",row.descripcion||" ",row.marca||" ",row.calidad||" ",row.categoria||" ",row.peso||" ",row.oferta_descuento||" ",row.precio_compra||" ",row.precio_venta||" ",row.estado||" "]);
  }
  async generaraPDF(){
    if(this.arraySelected<=0){
      alert("Seleccione todos los productos para poder generara el pdf")
    }else{
   console.log(this.arraySelected)
    const pdf = new PdfMakeWrapper();
    pdf.pageOrientation('landscape')
    pdf.pageSize('A3')
    pdf.add(pdf.ln(2))
    pdf.add(new Txt("Reporte Producto").bold().italics().alignment('center').end);
    pdf.add(pdf.ln(2))
    pdf.add(new Table([
      ['ID','Proveedor','Nombre','Descripción','Marca','Calidad','Categoria','Peso neto','Oferta descuento','Precio compra','Precio venta','Estado'],
      ]).widths(['*','*','*','*','*','*','*','*','*','*','*','*']).layout(
        {
          fillColor:(rowIndex?:number, node?:any, columnIndex?:number)=>{
            return rowIndex ===0 ? '#CCCCCC': '';
          }
        }
      ).end)
      pdf.add(new Table([
        ...this.extractData(this.arraySelected)
      ]).widths('*').end)

  pdf.create().open();
  }}
  exportSelectedX() {
    if (this.arraySelected.length < 1) {
      alert('Por favor seleccione al menos un producto')
    } else {
      for (let i = 0; i < this.arraySelected.length; i++) {
        let nuevoUserE = this.arraySelected[i]||+" ";
        if(nuevoUserE==null || nuevoUserE==undefined)
          nuevoUserE=""
        const usuarioImprimirSelected = {
          cedula:nuevoUserE.id,
           id_proveedor:nuevoUserE.id_proveedor,
           nombre:nuevoUserE.nombre,
           descripcion:nuevoUserE.descripcion,
           marca:nuevoUserE.marca,
           calidad:nuevoUserE.calidad,
           categoria:nuevoUserE.categoria,
           peso:nuevoUserE.peso,
           oferta_descuento:nuevoUserE.oferta_descuento,
           precio_compra:nuevoUserE.precio_compra,
           precio_venta:nuevoUserE.precio_venta,
           estado:nuevoUserE.estado
        }
        this.arrayExcel.push(usuarioImprimirSelected||"");
        console.log(this.arrayExcel)
      }
      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.arrayExcel);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "Usuarios");
      });
    }
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    location.reload();
  }

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
//
  
nombre_p:String="19224.jpg";
  cargarImagen() {
    this.fotoService.onUpload(this.selectedFile);
  }
  private urlApiFoto: string = 'http://localhost:5000/image';
  verImagen() {
    this.http.get(this.urlApiFoto + "/verfoto/" + this.pruebaimg)
      .subscribe(
        res => {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
      );
    //this.fotoService.getImage(this.nombre_orignal);
  }
fototraida : String ="";
  cargar_Datos():void{
    // Obtener los datos
   // Obtener los datos
   this.productoService.getProductsByEmpresa2(this.empresa.idEmpresa).subscribe(
    data => {
      let namef = data.imagen;
      this.producto = data;

      console.log("nombre imagenes "+this.producto.imagen);
      console.log(data);
      console.log("es el let"+ namef);
    },
    
      error => (console.log(error))
  )
  
  }

  // public carpurarimg(e:any){
  //   this.nombre_p= e.target.value;
  //   console.log(this.nombre_p);
  // }
}
