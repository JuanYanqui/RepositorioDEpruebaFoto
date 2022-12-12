import { Persona } from './persona';

export class Empresa {
  idEmpresa?: number;
  ruc!: string;
  mision!: string;
  vision!: string;
  nombre!: string;
  acronimo!: string;
  iva!:number;
  rolComercial!: string;
  logo!: string;
  pais!: string;
  provincia!: string;
  ciudad!: string;
  direccion!: string;
  codigoPostal!: string;
  telefono!: string;
  celular!: string;
  correo!: string;
  paginaWeb!: string;
  estado!: boolean;
  cuentasBancarias!: string[];

  persona?: Persona;
}
