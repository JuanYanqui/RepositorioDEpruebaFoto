import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/Models/Empresa';
import { Proveedor } from 'src/app/Models/proveedor';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { ProveedorService } from '../../Services/proveedor.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedor: Proveedor = new Proveedor();
  empresa:Empresa = new Empresa();
  name: string = '';
  nombreBanco:any;
  tipoCuenta:any;
  numeroCuenta:any;
  nombretitular:any;
  listBancos:any=[];
  fechaRegistro:any;
  data:any;
  blockSpecialCedula: RegExp = /^[^<>*!#@$%^_=+?`\|{}[\]~"'\.\,=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQWXYZ/;:]+$/
  blockSpecial: RegExp = /^[^<>*!$%^=+?`\|{}[\]~"'\\=/;:]+$/
  constructor(private usuarioService: UsuarioService, private serviceProveedor: ProveedorService) {}

  ngOnInit(): void {
    this.obtenerEmpresa();
  }

  obtenerEmpresa(){
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        this.empresa = data.empresa!;

        console.log(this.empresa);
      }
    )
  }

  crearProveedor(){
    if(this.validarCampos()==0){
    this.fechaRegistro= new Date();
    this.proveedor.estado=true;
    this.proveedor.cuentasBancarias=this.listBancos
    this.proveedor.fechaRegistro=this.fechaRegistro;
    this.proveedor.empresa=this.empresa
    this.serviceProveedor.save(this.proveedor).subscribe(data=>{
      alert("Proveedor registrado")
      this.limpiarCampos();
      console.log(data)
    })
  }else{
   alert("verifique los campos del proveedor")
  }
  }
  agregarBancos(){
  if(this.nombreBanco==null ||
    this.tipoCuenta==null ||
    this.numeroCuenta==null ||
    this.nombretitular==null){
      alert("Ingrese los datos de las cuentas bancarias")
  }else{
    this.listBancos.push(this.nombreBanco+" / "+this.tipoCuenta+" Nro. "+this.numeroCuenta+" Tit. "+this.nombretitular)
   this.nombreBanco=null;
   this.tipoCuenta=null;
   this.numeroCuenta=null;
   this.nombretitular=null;
  }
  }
  eliminarcuentaBanco(i:any){
    this.listBancos.splice(i,1)
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
