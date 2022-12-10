import { Producto } from "../Components/products/producto";
import { Pedido } from "./pedido";

export class ItemPedido{
    idItemPedido?: number;
    
    cantidad?: number;
    precio?: number;
    subtotal?: number;

    tipoUnidad?: string;
    valUnidad?: number;
    tipoPrecio?: string;
    unidadTotal?: number;

    producto?: Producto;
    pedido?: Pedido;
}