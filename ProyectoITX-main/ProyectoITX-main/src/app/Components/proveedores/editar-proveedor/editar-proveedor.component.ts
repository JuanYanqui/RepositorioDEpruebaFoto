import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ProveedorService } from '../../../Services/proveedor.service';
import { Proveedor } from 'src/app/Models/proveedor';
import { ProductosService } from '../../products/productos.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Empresa } from 'src/app/Models/Empresa';
import { Producto } from '../../products/producto';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.css']
})
export class EditarProveedorComponent implements OnInit {
  @Input()datainicial:any;
  @ViewChild('asInpRUC')
   rucPRO!:ElementRef;
  @ViewChild('asInpNOMB')
   nombrePRO!:ElementRef;
   @ViewChild('asInpEMAIL')
   emailPRO!:ElementRef;
   @ViewChild('asInpWEB')
   webPRO!: ElementRef;
   @ViewChild('asInpTELF')
   telefonoPRO!: ElementRef;
   @ViewChild('asInpCEL')
   celPRO!: ElementRef;
   @ViewChild('asInpNOMBANC')
   NomBancPRO!: ElementRef;
   @ViewChild('asInpTCUEN')
   cuentaBancPRO!: ElementRef;
   @ViewChild('asInpNUMCU')
   numCuenBancPRO!: ElementRef;
   @ViewChild('asInpNOMTI')
   nomTituBancoPRO!: ElementRef;
   @ViewChild('asBtnBNC')
   btnBNCPRO!: ElementRef;
   @ViewChild('asBtnBNCDE')
   btndeltBancPRO!: ElementRef;
   @ViewChild('asInpOBSER')
   obserPRO!:ElementRef;
   @ViewChild('asBtnSAVE')
   btnSavePRO!:ElementRef;
   @ViewChild('asbtnVER')
   btnVerPRO!:ElementRef;
   @ViewChild('asbtnEDITAR')
   btnEditPRO!:ElementRef;
   @ViewChild('asbtnReg')
   btnregrePRO!:ElementRef;
   @ViewChild('aslblNumCuenta')
   lblNumCuen!:ElementRef;
   @ViewChild('asSelecTipCuen')
   selectTipCuen!:ElementRef;
   @ViewChild('asTipCuent')
   lbltipCuent!:ElementRef;
   @ViewChild('aslblNomtit')
   lblNomtit!:ElementRef;
  proveedor:Proveedor=new Proveedor()
  nombreBanco:any;
  tipoCuenta:any;
  numeroCuenta:any;
  estadoBtns:any=1;
  borrrar:any;
  estadoProveedor:any;
  nombretitular:any;
  loading: boolean = true;
  listaProveedores:any;
  listaProductospROVE:any;
  idEMpresa:any;
  listBancos:any=[];
  empresa:Empresa = new Empresa();
  proveedor2:any;
  producto!:Producto ;
  blockSpecialCedula: RegExp = /^[^<>*!#@$%^_=+?`\|{}[\]~"'\.\,=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQWXYZ/;:]+$/
  blockSpecial: RegExp = /^[^<>*!$%^=+?`\|{}[\]~"'\\=/;:]+$/
  constructor(private usuarioService:UsuarioService ,private proveedorServie:ProveedorService, private productosService:ProductosService) { }
  ngOnInit(): void {
    this.obtenerEmpresa()
    this.loading=false
  }
  actualizarProveedor(){
    const codigo=this.datainicial
    this.proveedor.cuentasBancarias=this.listBancos
  this.proveedorServie.updateProveedor(this.proveedor,codigo).subscribe(data=>{
  alert("Proveedor actualizado")
  })
  }
  buscarProveedor(){
    this.proveedorServie.listarporId(this.datainicial).subscribe(data=>{
      this.proveedor=data
      this.productosService.getProductsByEmpresa(this.empresa.idEmpresa).subscribe(data1=>{
        this.listaProveedores=data1
/*        for(let i of data1){
          this.producto=i
          this.proveedor2=this.producto.proveedores
          console.log(this.proveedor2.idProveedor)
          if(this.proveedor2.idProveedor==this.proveedor.idProveedor){
            this.listaProveedores.push(data1)
          }
        }*/
      })
      this.listBancos=data.cuentasBancarias
    })
  }
  obtenerEmpresa(){
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        this.empresa = data.empresa!;
        this.idEMpresa=data.empresa!.idEmpresa
      }
    )
  }
  editarProveedor(){
    this.borrrar=1
    this.estadoBtns=0
    this.estadoProveedor=0
    setTimeout(()=>{
      this.buscarProveedor()
    }, 100)
  }
  verProveedor(){
    this.borrrar=0;
    this.estadoBtns=0
    this.estadoProveedor=0
    setTimeout(() => {
      const numerocuenta = this.lblNumCuen.nativeElement;
      const selctedCuen= this.selectTipCuen.nativeElement;
      const tipCuentlbl = this.lbltipCuent.nativeElement;
      const nomtitu = this.lblNomtit.nativeElement;
     const ruc = this.rucPRO.nativeElement;
     const nombreProveedor = this.nombrePRO.nativeElement;
     const emailProveedor = this.emailPRO.nativeElement;
     const webProveedor = this.webPRO.nativeElement;
     const telefonoProveedor = this.telefonoPRO.nativeElement;
     const celularProveedor = this.celPRO.nativeElement;
     const nombreBanco = this.NomBancPRO.nativeElement;
     const cuentaBancaria = this.cuentaBancPRO.nativeElement;
     const numeroCuencaBanca = this.numCuenBancPRO.nativeElement;
     const nombreTituBanco = this.nomTituBancoPRO.nativeElement;
     const btnSaveBanco = this.btnBNCPRO.nativeElement;
     const observacionesPro = this.obserPRO.nativeElement;
     const btnSaveProveedor = this.btnSavePRO.nativeElement;
     numerocuenta.style.display = 'none';
     selctedCuen.style.display = 'none';
     tipCuentlbl.style.display = 'none';
     nomtitu.style.display = 'none';
    btnSaveBanco.style.display = 'none';
      btnSaveProveedor.style.display = 'none';
     observacionesPro.disabled = true;
     ruc.disabled = true;
     nombreProveedor.disabled = true;
     emailProveedor.disabled = true;
     webProveedor.disabled = true;
     telefonoProveedor.disabled = true;
     celularProveedor.disabled = true;
     nombreBanco.style.display = 'none';
     cuentaBancaria.style.display = 'none';
     numeroCuencaBanca.style.display = 'none';
     nombreTituBanco.style.display = 'none';
     this.buscarProveedor()
    }, 100);
  }
  regresarbtn(){
    this.estadoBtns=1
    this.estadoProveedor=1
    this.vaciarcampos()
  }

  vaciarcampos(){
    this.proveedor.celularProveedor=""
    this.proveedor.cuentasBancarias=[]
    this.proveedor.emailProveedor=""
    this.proveedor.nombreProveedor=""
    this.proveedor.observaciones=""
    this.proveedor.paginaWeb=""
    this.proveedor.ruc=""
  }

agregarBancos(){
 this.listBancos.push(this.nombreBanco+" / "+this.tipoCuenta+" Nro. "+this.numeroCuenta+" Tit. "+this.nombretitular)
 this.nombreBanco=null;
 this.tipoCuenta=null;
 this.numeroCuenta=null;
 this.nombretitular=null;
}
eliminarcuentaBanco(i:any){
  if(this.borrrar===1){
  this.listBancos.splice(i,1)
  }
}
limpiarCampos(){
  this.proveedor.ruc=""
  this.proveedor.nombreProveedor=""
  this.proveedor.celularProveedor=""
  this.proveedor.emailProveedor=""
  this.proveedor.observaciones=""
  this.proveedor.paginaWeb=""
  this.proveedor.telefonoProveedor=""
  this.listBancos=null
}
validarCampos(){
  var verificacion=0
  if(this.proveedor.ruc==null || this.proveedor.ruc.length<=9){
     verificacion=verificacion+1;
  }else if(this.proveedor.nombreProveedor==null || this.proveedor.nombreProveedor.length<=0){
     verificacion=verificacion+1;
  }
  return verificacion
}

}
