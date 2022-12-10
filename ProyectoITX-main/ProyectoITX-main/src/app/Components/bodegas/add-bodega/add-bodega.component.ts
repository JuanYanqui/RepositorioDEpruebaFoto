import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresa } from 'src/app/Models/Empresa';
import { PersonalCargoService } from 'src/app/Services/personal-cargo.service';
import { SharedServices } from 'src/app/Services/shared.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { PersonalCargo } from '../../../Models/personal-cargo';
import { AlertsService } from '../../../Services/alerts/alerts.service';
import { Bodega } from '../bodega';
import { BodegasService } from '../bodegas.service';

@Component({
  selector: 'app-add-bodega',
  templateUrl: './add-bodega.component.html',
  styleUrls: ['./add-bodega.component.css'],
})
export class AddBodegaComponent implements OnInit {
  bodegaForm!: FormGroup;
  validPattern = '^(?! )^[A-Za-z0-9 ]+$';
  validNumberPatern = '[0-9]*';
  bodega = {} as Bodega;
  loading = false;
  personal: PersonalCargo[] = [];
  empresa = new Empresa();
  bodegero = new PersonalCargo();
  bodegeros: PersonalCargo[] = [];

  countries: any[] = [];
  selectedCity1: any;

  constructor (
    private formBuilder: FormBuilder,
    private bodegaService: BodegasService,
    private alertService: AlertsService,
    private personalCargoService: PersonalCargoService,
    private usuarioService: UsuarioService, private sharedServices: SharedServices
  ) {}

  ngOnInit(): void {
    this.obtenerEmpresa();
    this.loadFormGroup();
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
  selectBodegero(event: any) {
    this.bodegero = this.personal[event.target.value];
    this.bodegeros.push(this.bodegero);
  }
  resetForm() {
    this.loadFormGroup();
  }
  obtenerEmpresa() {
    let idUsuario = localStorage.getItem('idUsuario');
    this.usuarioService.getPorId(idUsuario).subscribe({
      next: (data) => (this.empresa = data.empresa!),
      complete: () => this.getPersonal(),
    });
  }

  getPersonal() {
    this.personalCargoService
      .getByEmpresaCargo(this.empresa.idEmpresa, 'Bodega')
      .subscribe({
        next: (bodegero) => {
          this.personal = bodegero;
          console.log(this.personal);
        },
      });
  }

  addBodega() {
    if (this.bodegaForm.valid) {
      this.bodega = this.bodegaForm.value;
      this.bodega.inventario_disponible = 0;
      this.bodega.personalCargos = this.bodegeros
      this.bodega.estado = true;
      this.bodega.empresa = this.empresa;
      // console.log(this.bodega);
      this.bodegaService.addBodega(this.bodega).subscribe({
        complete: () => {
          this.resetForm()
          this.alertService.showSuccess(
            'Bodega registrada correctamente',
            'Bodegas'
          ); this.loading = false;
        }, next: (d) => {
          console.log(d)
        },
        error: (error) => {
          this.alertService.showError(error.message, 'Error registro');
          this.loading = false;
        }
      });
    } else {
      console.log('No está validado');
    }
  }

  get f() {
    return this.bodegaForm.controls;
  }
  loadFormGroup() {
    this.bodegaForm = this.formBuilder.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(this.validPattern)],
      ],
      direccion: ['', Validators.required],
      localidad: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(this.validNumberPatern)]],
      personalCargos: ['', Validators.required],
      tipobodega: ['', Validators.required],
      capacidad_max: ['', [Validators.required, Validators.pattern(this.validNumberPatern)],
      ],
      descripcion: ['', !Validators.required],
    });
  }
}
