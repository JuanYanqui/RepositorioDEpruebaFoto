
import { Bodega } from "src/app/Components/bodegas/bodega";
import { Cargo } from "src/app/modules/models/cargo";
import { Personal } from "src/app/modules/models/personal";

export class PersonalCargo {
    idPersonalCargo?: number;
    estado!: boolean;
    personal?: Personal;
    cargo?: Cargo;
    bodega?: Bodega;
}