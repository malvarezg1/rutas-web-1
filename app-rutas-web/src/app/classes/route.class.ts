import { Waypoint } from './waypoint.class';
/**
 * Clase que representa la planeacion de una ruta
 */


export class Route{    

    constructor(private id:number,
                private description: string = `esta es la descripcion de la ruta ${id}`,
                private waypoints: Waypoint[] = [],
                 ){}

    
        
}