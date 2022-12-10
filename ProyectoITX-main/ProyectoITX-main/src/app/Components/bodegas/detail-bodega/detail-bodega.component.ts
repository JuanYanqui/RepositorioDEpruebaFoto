import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Empresa } from 'src/app/Models/Empresa';
import { PersonalCargo } from 'src/app/Models/personal-cargo';
import { PersonalCargoService } from 'src/app/Services/personal-cargo.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { AlertsService } from '../../../Services/alerts/alerts.service';
import { Bodega } from '../bodega';
import { BodegasService } from '../bodegas.service';

@Component({
  selector: 'app-detail-bodega',
  templateUrl: './detail-bodega.component.html',
  styleUrls: ['./detail-bodega.component.css'],
})
export class DetailBodegaComponent implements OnInit {

  constructor (
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private bodegaService: BodegasService, private usuarioService: UsuarioService,
    private alertService: AlertsService, private personalCargoService: PersonalCargoService,
  ) {}

  bodegaForm!: FormGroup;
  validPattern = '^(?! )^[A-Za-z0-9 ]+$';
  validNumberPatern = '^[0-9]+([.|,][0-9]+)?$';
  bodega = {} as Bodega;
  bodega$!: Observable<Bodega>;
  loading = false;
  id = 0;
  empresa = new Empresa();
  currentPersonal = new PersonalCargo();
  personal: PersonalCargo[] = [];

  bodegero = new PersonalCargo();
  bodegeros: PersonalCargo[] = [];

  updateBodega() {
    if (this.bodegaForm.valid) {
      this.bodega = this.bodegaForm.value;
      this.bodega.inventario_disponible = 0;
      this.bodega.estado = this.bodegaForm.value.estado;
      this.bodega.personalCargos = [this.bodegero];
      this.bodega.empresa = this.empresa;

      this.bodegaService
        .updateBodega(this.bodega, this.id.toString())
        .subscribe(
          (response) => {
            this.bodegaForm.reset();
            this.alertService.showSuccess(
              'Bodega registrada correctamente',
              'Bodegas'
            );
            this.loadFormGroup();
            this.updateForms();
            this.loading = false;
          },
          (error) => {
            this.alertService.showError(error.message, 'Error registro');
            this.loading = false;
          }
        );
    } else {
      console.log('No está validado');
    }
  }
  get f() {
    return this.bodegaForm.controls;
  }

  getById() {
    this.bodega$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.bodegaService.getBodegaById(params.get('id')!)
      )
    );
  }

  obtenerEmpresa() {
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe({
      next: (data) => (this.empresa = data.empresa!),
      complete: () => this.getPersonal(),
    });
  }

  getIndexPersonal() {
    var per = new PersonalCargo;
    this.personal.forEach((element) => {
      if (element.personal?.usuario?.persona?.nombres === this.currentPersonal.personal?.usuario?.persona?.nombres) {
        per = element;
      }
    });
    this.bodegaForm.patchValue({ personalCargos: this.personal.indexOf(per) });
  }

   getPersonal() {
    this.personalCargoService
      .getByEmpresaCargo(this.empresa.idEmpresa, 'Bodega')
      .subscribe({
        next: (bodegero) => {
          this.personal = bodegero;
        },
        complete: () => {
          this.getIndexPersonal()
        }
      });
  }

  selectBodegero(event: any) {
    this.bodegero = this.personal[event.target.value];
  }

  async updateForms() {
    await this.bodega$.subscribe({
      next: (data) => {
        console.warn(data);

        this.id = data.id;
        this.bodegaForm.patchValue({
          nombre: data.nombre, direccion: data.direccion, localidad: data.localidad, telefono: data.telefono, tipobodega: data.tipobodega, capacidad_max: data.capacidad_max, descripcion: data.descripcion, estado: data.estado
        });
        this.currentPersonal = data.personalCargos[0];
        this.bodegero = data.personalCargos[0];
      }
    });
  }

  loadFormGroup() {
    this.bodegaForm = this.formBuilder.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(this.validPattern)],
      ],
      direccion: ['', Validators.required],
      localidad: ['', Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.pattern(this.validNumberPatern)],
      ],
      personalCargos: ['', Validators.required],
      tipobodega: ['', Validators.required],
      capacidad_max: [
        '',
        [Validators.required, Validators.pattern(this.validNumberPatern)],
      ],
      descripcion: ['', !Validators.required],
      estado: ['', !Validators.required],
    });
  }
  countries: any[] = [];
  selectedCity1: any;
   ngOnInit(): void {
    this.obtenerEmpresa();
    this.loadFormGroup();
     this.getById();
     this.updateForms();
    this.countries = [{
      "provincia": "AZUAY",
      "cantones": [{ "canton": "CUENCA" },
      { "canton": "GIRÓN" },
      { "canton": "GUALACEO" },
      { "canton": "NABÓN" },
      { "canton": "PAUTE" },
      { "canton": "PUCARA" },
      { "canton": "SAN FERNANDO" },
      { "canton": "SANTA ISABEL" },
      { "canton": "SIGSIG" },
      { "canton": "OÑA" },
      { "canton": "CHORDELEG" },
      { "canton": "EL PAN" },
      { "canton": "SEVILLA DE ORO" },
      { "canton": "GUACHAPALA" },
      { "canton": "CAMILO PONCE ENRÍQUEZ" }
      ]
    }];

  }
}
