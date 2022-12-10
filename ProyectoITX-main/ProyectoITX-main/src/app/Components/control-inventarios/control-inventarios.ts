import { Empresa } from "src/app/Models/Empresa";
import { Bodega } from "../bodegas/bodega";
import { CompraDetail } from "../compras/compradetail";

export interface ControlInventarios {
    id?: number;

    stock_min: number;
    stock_max: number;
    fecha_elaboracion: Date;
    fecha_caducidad: Date;
    detalleCompras: CompraDetail;
    bodega: Bodega;
    empresa: Empresa;

}
