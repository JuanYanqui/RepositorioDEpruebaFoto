import { Clientes } from "./clientes";

export class Pedido{
    idPedido?: number;
    
    fechaPedido!: Date;
    revicion!: boolean;
    aceptacion!: boolean;
    fechaRevicion!: Date;

    cliente?: Clientes
}