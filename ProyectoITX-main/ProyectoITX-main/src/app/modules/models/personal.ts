import { Usuario } from './Usuario';

export class Personal {
    idPersonal?: number;
    horario?: string;
    salario?: DoubleRange;
    estado?:boolean
    fechaRegistro?: Date;
    lugarTrabajo?: string;
    fotoPerfil!: string;   

    usuario?:Usuario;
    
}
