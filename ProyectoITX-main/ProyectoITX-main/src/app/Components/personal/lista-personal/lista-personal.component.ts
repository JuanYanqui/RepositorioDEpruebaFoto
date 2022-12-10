import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PdfMakeWrapper, Txt, Table } from 'pdfmake-wrapper';
import { Empresa } from 'src/app/Models/Empresa';
import { PersonalCargo } from 'src/app/Models/personal-cargo';
import { Usuario } from 'src/app/Models/Usuario';
import { PersonalCargoService } from 'src/app/Services/personal-cargo.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { PersonalService } from '../../../Services/personal.service';

@Component({
  selector: 'app-lista-personal',
  templateUrl: './lista-personal.component.html',
  styleUrls: ['./lista-personal.component.css']
})
export class ListaPersonalComponent implements OnInit {
  datainicial:any;
  loading:any;
  arraySelected:any=[];
  datosmuestra:any;
  datainicialPersonal:any;
  displayMaximizable:any;
  listaPersonalCargos: PersonalCargo[] = [];
  @ViewChild('dt') dt: Table | undefined;
  empresa: Empresa = new Empresa;
  constructor(private toastr: ToastrService, private personalCargoService: PersonalCargoService, private usuarioService: UsuarioService, private servicepersonal:PersonalService, private root:Router) { }

  ngOnInit(): void {
    this.obtenerEmpresa();
  }

  obtenerEmpresa(){
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe(
      data => {
        this.empresa = data.empresa!;

        console.log(this.empresa);
        this.obtenerPersonal();
      }
    )
  }

  obtenerPersonal(){
    this.personalCargoService.getByEmpresa(this.empresa.idEmpresa).subscribe(
      data => {
        console.log(data);
        this.listaPersonalCargos = data.map(

          result => {
            let personalCargo = new PersonalCargo;
            personalCargo = result;

            return personalCargo;
          }
        )
      }
    )
  }

  deshabilitar(personalCargo: PersonalCargo){
    let accion: string;
    let usuario: Usuario = new Usuario;
    usuario = personalCargo.personal?.usuario!;

    if (!personalCargo.estado){
      personalCargo.estado = false;
      usuario.estado = false;
      accion = 'Deshabilitado el cargo '+personalCargo.cargo?.nombre;
    }else{
      personalCargo.estado = true;
      usuario.estado = true;
      accion = 'Habilitado el cargo '+personalCargo.cargo?.nombre;
    }

    this.usuarioService.updateUsuario(usuario, usuario.idUsuario).subscribe(
      result => {
        console.log(result);
        this.personalCargoService.update(personalCargo, personalCargo.idPersonalCargo).subscribe(
          data => {
            console.log(data);
            this.toastr.warning(accion,'Advertencia!')
          }
        )
      }
    )
  }

  agregar(){
    this.root.navigate(['personal']);
  }
  editar(idpersonal:any){
    this.datainicialPersonal=idpersonal
    this.showMaximizableDialog()
  }

  showMaximizableDialog() {
    this.displayMaximizable = true;
}

extractData(datosTabla:any){
  return datosTabla.map((row:any) => [row.idPersonalCargo,row.personal?.usuario?.persona?.cedula,row.personal?.usuario?.persona?.nombres+" "+row.personal?.usuario?.persona?.apellidos,row.cargo?.nombre,row.estado]);
}
async generaraPDF(){
  if(this.arraySelected<=0){
    alert("Seleccione uno o todos los usuarios para poder generara el pdf")
  }else{
 console.log(this.arraySelected)
  const pdf = new PdfMakeWrapper();
  pdf.pageOrientation('portrait')
  pdf.pageSize('A4')
  pdf.add(pdf.ln(2))
  pdf.add(new Txt("Reporte Personal").bold().italics().alignment('center').end);
  pdf.add(pdf.ln(2))
  pdf.add(new Table([
    ['Codigo','Cedula','Nombre', 'Cargo', 'Estado'],
    ]).widths(['*','*','*','*','*']).layout(
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
}
