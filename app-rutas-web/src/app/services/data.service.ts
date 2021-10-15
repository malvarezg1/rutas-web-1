import { Injectable } from '@angular/core';
import { Path } from '../classes/path.class';


@Injectable({
    providedIn: 'root'
})
export class RoutesService {

    private rutas: Path[] = [new Path(0, `PATH-${0}`,[])];





    constructor(){
        console.log("Servicio de informacion de rutas listo para usar")
    }

    getRutas(){
        return this.rutas;
    }
}