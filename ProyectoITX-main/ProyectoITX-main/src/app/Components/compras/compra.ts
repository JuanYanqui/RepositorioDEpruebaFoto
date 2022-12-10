import { Proveedor } from 'src/app/Models/proveedor';
import { Producto } from '../products/producto';
export interface Compra {
  id?: number;
  producto: Producto;
  cantidad: number;
  cantidad_unitarias: number;
  unidad: string;
  valor_total: number;
  proveedor: Proveedor;
}
