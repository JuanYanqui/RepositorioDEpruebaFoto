import { Empresa } from "./Empresa";

export class Proveedor {
    idProveedor?: number;
    ruc?: string;
    nombreProveedor?: string;
    estado?: boolean;
    fechaRegistro?: Date;
    cuentasBancarias?: String[];
    giroProveedor?: string;
    observaciones?: string;
    emailProveedor?: string;
    celularProveedor?: string;
    telefonoProveedor?: string;
    paginaWeb?: string;
    empresa?:Empresa;
}
