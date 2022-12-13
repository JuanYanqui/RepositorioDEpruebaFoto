import { Empresa } from 'src/app/modules/models/Empresa';
import { Proveedor } from 'src/app/modules/models/proveedor';
import { Compra } from './compra';
export interface CompraDetail {
  id: number;
  estado: string;
  compras: Compra[];
  fecha_pedido: Date;
  empresa:Empresa;

  valor_total: number;
}
