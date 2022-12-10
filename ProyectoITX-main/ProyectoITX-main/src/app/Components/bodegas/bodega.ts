import { PersonalCargo } from 'src/app/Models/personal-cargo';
import { Empresa } from '../../Models/Empresa';
export interface Bodega {
  id: number;
  nombre: string;
  tipobodega: string;
  direccion: string;
  localidad: string;
  capacidad_max: number;
  inventario_disponible: number;
  telefono: string;
  descripcion: string;
  personalCargos: PersonalCargo[];
  estado: boolean;
  empresa: Empresa;
}
