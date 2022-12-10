import { Bodega } from "../Components/bodegas/bodega";
import { Cargo } from "./cargo";
import { Personal } from "./personal";

export class PersonalCargo{
    idPersonalCargo?: number;
    estado!: boolean;
    personal?: Personal;
    cargo?: Cargo;
    bodega?: Bodega;
}