import { Empresa } from "./Empresa";
import { Pedido } from "./pedido";
import { Persona } from "./persona";

export class VentaPedido{
    idVentaPedido?: number;

    metodoPago?: string;
    estadoVenta?: boolean;
    fechaVenta?: Date;
    estadoEntrega?: boolean;
    fechaEntrega?: Date;
    valorPagar?: number;
    valorCaja?: number;
    vuelto?: number;

    isOnline?: boolean;

    valorIva?: number;
    valorSinIva?: number;
    numeroCheque?: string;
    numeroTarjeta?: string;

    pedido?: Pedido;
    persona?: Persona;
    empresa?: Empresa;
}