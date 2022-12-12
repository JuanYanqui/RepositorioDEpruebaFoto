import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PersonalCargoService } from 'src/app/modules/services/personal-cargo.service';
import { UsuarioService } from 'src/app/modules/services/usuario.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit, OnDestroy {

  items: MenuItem[] | any;
  idUsuario: any;
  nombreUsuario: any;

  isSuperAdmin: boolean = false;
  isClientAdmin: boolean = false;
  isClient: boolean = false;
  isPublic: boolean = false;

  isGerente: boolean = false;
  isBodega: boolean = false;
  isVenta: boolean = false;
  displayMaximizable: any;
  isLogin: boolean = false;


  constructor(
    private personalCargoService: PersonalCargoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }
  ngOnDestroy() {
    console.log("as");
  }

  obtenerUsuario() {
    this.idUsuario = localStorage.getItem('idUsuario');
    this.verImagen();
    if (this.idUsuario != '' && this.idUsuario != undefined) {
      this.usuarioService.getPorId(this.idUsuario).subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.isLogin = true;

          this.nombreUsuario = data.persona?.nombres + ' ' + data.persona?.apellidos;

          switch (data.rol?.nombre) {
            case 'INVITADO':
              this.isSuperAdmin = false;
              this.isClientAdmin = false;
              this.isClient = false;
              this.isPublic = true;
              break;
            case 'CLIENTE':
              this.isSuperAdmin = false;
              this.isClientAdmin = false;
              this.isClient = true;
              this.isPublic = true;
              break;
            case 'CLIENTE ADMINISTRADOR':
              this.isSuperAdmin = false;
              this.isClientAdmin = true;
              this.isClient = false;
              this.isPublic = false;
              this.verificarCargosClientAdmin(data.idUsuario);
              break;
            case 'SUPER ADMINISTRADOR':
              this.isSuperAdmin = true;
              this.isClientAdmin = false;
              this.isClient = false;
              this.isPublic = false;
              break;
            default:
              alert('Rol desconocido');
              break;
          };

        } else {
          this.isLogin = false;
          this.nombreUsuario = 'NULL';
        }
      });
    }
  }

  verificarCargosClientAdmin(idUsuario: any) {
    console.log('Comprobando los cargos del usuario ...')
    this.personalCargoService.getByUsuario(idUsuario).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.isGerente = false;
          data.forEach(personal => {
            if (personal.cargo?.nombre === 'Bodega') {
              this.isBodega = true;
            } else if (personal.cargo?.nombre === 'Venta') {
              this.isVenta = true;
            }
          });
        } else {
          this.isGerente = true;
          this.isBodega = true;
          this.isVenta = true;
        }
      }
    )
  }

  iniciarSesion() {
    //   location.replace('/log-in');

    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['log-in']);
      });
  }

  registrarse() {
    //   location.replace('/add-public-prolife');

    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['add-public-prolife']);
      });
  }

  cerrarSesion() {
    sessionStorage.removeItem('productosPedido');
    localStorage.removeItem('idUsuario');
    location.replace('/log-in');
    // this.router
    //   .navigateByUrl('/', { skipLocationChange: true })
    //   .then(() => {
    //     this.router.navigate(['log-in']);
    //   });
  }
  showMaximizableDialog() {
    this.displayMaximizable = true;
  }

  // CARGAR IMAGEN
  message: string="";
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  private urlApiFoto: string = 'http://localhost:5000/image';
  nameImagen:any;

  verImagen() {
    this.nameImagen = localStorage.getItem('nameImagen');
    this.http.get(this.urlApiFoto + "/verfoto/" + this.nameImagen)
      .subscribe(
        res => {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
      );
    //this.fotoService.getImage(this.nombre_orignal);
  }

}
