
/**
 * Clase que representa un pathpoint de una ruta
 */
export class PathPoint {   

    /**
     * crea un nuevo pathpoint
     * @param id orden del pathpoint en la ruta(inicia en 0)
     * @param ZLatitude latitud global del punto
     * @param XLongitude longitud global del punto
     * @param YAltitude  altura del punto en metros
     * @param task (optional)id de la tarea asociadaa ese punto | 0: none | 1: photo | 2: video | 3: interval photo | 4: panoramic |
     * @param instruction (optional)instruccion asociada a la tarea panoramica | 
     */
    constructor(public ID: number,                
                public XLongitude: number,
                public ZLatitude: number,
                public YAltitude: number = 0,
                public task: number = 0,
                public instruction: string ='' )
    {
        
    }


    toString():string{
        return `waypoint:${this.ID} |  lat:${this.ZLatitude} | lng:${this.XLongitude} | alt:${this.YAltitude} | task:${this.task} | instruction: ${this.instruction}|`
    }
    
}


