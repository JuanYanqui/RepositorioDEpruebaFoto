import { Component, OnInit } from '@angular/core';
import { Producto } from '../products/producto';
import { ProductosService } from '../products/productos.service';
import { UsuarioService } from '../../Services/usuario.service';
import { Empresa } from 'src/app/Models/Empresa';
import { CategoriaService } from '../../Services/categoria.service';
import { Categoria } from '../../Models/categoria';
import { EmpresaService } from '../../Services/empresa.service';
import { AlertsService } from '../../Services/alerts/alerts.service';
import { CargoService } from '../../Services/cargo.service';
import { Cargo } from '../../Models/cargo';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit {
  categoriaArray:any=[];
  id:any;
  categoriatxt:any;
  menuProductos:any=1
  menuPersonal:any=0
  descripcionpersonaltxt:any;
  arraycargaCargo:any=[];
  menuOtros:any=0
  bancodestxt:any;
  bancoArray:any=[]
  bancocargaArray:any=[];
  tipoBanco:any;
  tipoCuenta:any;
  numeroCuenta:any;
  personaltxt:any;
  personalArray:any=[];
  productosCategoriaArray:any=[]
  productos= {} as Producto;
  empresa:Empresa=new Empresa();
  categoria:Categoria=new Categoria();
  cargo:Cargo=new Cargo();
  constructor(private cargoService:CargoService,private alertService: AlertsService,private empresaService:EmpresaService,private categoriasService:CategoriaService,private productosServices:ProductosService, private usuariosService:UsuarioService) { }

  ngOnInit(): void {
    this.obtenerEmpresa()
    this.obtenerCategoria()
    this.optenerCargo()
  }
  obtenerProdctos(){
    this.productosServices.getProductsByEmpresa2(this.empresa.idEmpresa).pipe()
      .subscribe({
        next: (producto) => (this.productos = producto),
        error: (err) => {
          console.log(err.message);
        },
      });
   }
   obtenerCategoria(){
    this.categoriasService.getCategorias().subscribe(data=>{
      this.categoriaArray=data
      console.log(data)
      console.log(this.categoriaArray)
    })
   }
   agregarCategoriaSer(){
     if(this.productosCategoriaArray.length!=0){
       for(let array of this.productosCategoriaArray){
          this.categoria.nombre=array.nombre
          this.categoriasService.addcategoria(this.categoria).subscribe(data =>{
            console.log(data)
            this.productosCategoriaArray=[]
            this.categoriaArray=[]
            this.obtenerCategoria()
          })
       }
     }
   }
  obtenerEmpresa() {
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuariosService.getPorId(idUsuario).subscribe({
      next: (data) => {
        this.empresa = data.empresa!;
        this.bancoArray=this.empresa.cuentasBancarias;
      },
      error: (error) => console.log(error),
      complete: () => this.obtenerProdctos(),
    });
  }
  actualizaEmpresa(){
     this.empresaService.postEmpresa(this.empresa).subscribe(data=>{
       console.log(data)
       this.agregarCategoriaSer()
     })
     alert("Productos actualizados")
  }
  menuproductos(){
    this.menuProductos=1
    this.menuPersonal=0
    this.menuOtros=0
  }
  menupersonal(){
    this.menuProductos=0
    this.menuPersonal=1
    this.menuOtros=0
  }
  menuotros(){
    this.menuProductos=0
    this.menuPersonal=0
    this.menuOtros=1
  }
  agregarCategoria(){
    if(this.categoriatxt=="" || this.categoriatxt==null || this.categoriatxt==" "){
      alert("Ingrese una categoria")
    }else{
    this.categoriaArray.push({"nombre":this.categoriatxt,"eliminar":1, "id":this.categoriaArray.length+1})
    this.productosCategoriaArray.push({"nombre":this.categoriatxt,"id":this.categoriaArray.length+1})
    this.categoriatxt=""
    }
  }
  eliminarCategoria(event:any, nombre:any){
    var numero = event
    var contador = 0
    console.log(this.productosCategoriaArray)
    for(let i of this.categoriaArray){
      contador = 0
       for(let j of this.productosCategoriaArray){
        if(i.nombre == nombre && j.nombre == nombre){
            this.categoriaArray.splice(event,1)
            this.productosCategoriaArray.splice(contador,1)
            console.log(this.productosCategoriaArray)
        }else{
          contador = contador + 1;
        }
       }
    }
  }
  agregarCargosPersonal(){
    if(this.personaltxt=="" || this.personaltxt==null || this.personaltxt==" "){
      alert("Ingrese el Cargo del personal")
    }else{
   this.personalArray.push({"nombre":this.personaltxt,"descripcion":this.descripcionpersonaltxt,"eliminar":1})
   this.arraycargaCargo.push({"nombre":this.personaltxt,"descripcion":this.descripcionpersonaltxt,"eliminar":1, "idCargo":this.personalArray.length+1})
   this.personaltxt=""
   this.descripcionpersonaltxt=""
  }
  }
  eliminarCargoPersonal(event:any, nombre:any){
   let contador=0;
   for(let i of this.personalArray){
     contador=0
     for(let j of this.arraycargaCargo){
       if(j.nombre==nombre && j.nombre==nombre){
        this.personalArray.splice(event,1)
        this.arraycargaCargo.splice(contador,1)
        console.log(this.arraycargaCargo)
       }else{
         contador = contador + 1
       }
     }
   }
  }
  agregarBancos(){
    this.bancodestxt = "BANCO/COOPERATIVA: "+this.tipoBanco+" TIPO DE CUENTA: "+this.tipoCuenta+" NÚMERO:"+this.numeroCuenta
    if(this.bancodestxt=="" || this.bancodestxt==null || this.bancodestxt==" "){
      alert("Ingrese la ciudad")
    }else{
   this.bancoArray.push(this.bancodestxt)
   this.bancocargaArray.push(this.bancodestxt)
   this.bancodestxt=""
  }
  }
  eliminarCiudades(event:any){
    var contador=0
    for(let i of this.bancoArray){
      console.log(+this.bancocargaArray)
      contador=0
      for(let j of this.bancocargaArray){
        if(this.bancoArray.this.bancodestxt==this.bancocargaArray.bancodestxt){
           this.bancoArray.splice(event,1)
           this.bancocargaArray.splice(contador,1)
           console.log(this.bancocargaArray)
        }else{
          contador=contador+1
        }
      }
    }
  }
  optenerCargo(){
   this.cargoService.getAll().subscribe(data=>{
     this.personalArray=data
     console.log(data)
   })
  }
  actualizarPersonal(){
    if(this.arraycargaCargo.length!=0){
      for(let dataArray of this.arraycargaCargo){
        this.cargo.nombre=dataArray.nombre
        this.cargo.descripcion=dataArray.descripcion
   this.cargoService.post(this.cargo).subscribe(data=>{
     console.log(data)
   })
  }
}
alert("Cargo agregados exitosamente")
this.arraycargaCargo=[]
this.personalArray=[]
this.optenerCargo()
}
actualizarEmpresa(){
  this.empresa.cuentasBancarias=this.bancoArray
  this.empresaService.updateEmpresa(this.empresa,this.empresa.idEmpresa).subscribe(data=>{
     console.log(data)
     alert("Empresa Actualizada")
  })
}
}
