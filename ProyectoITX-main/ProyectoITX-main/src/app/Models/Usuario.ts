import { Empresa } from "./Empresa";
import { Persona } from "./persona";
import { Roles } from "./Roles";

export class Usuario{
    idUsuario?: number;
    username!: string;
    password!: string;
    estado!: boolean;
    
    persona?: Persona;
    empresa?: Empresa;
    rol?: Roles;
}