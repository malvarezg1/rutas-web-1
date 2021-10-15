
/**
 * Clase que representa un pathpoint de una ruta
 */
export class PathPoint {   

    /**
     * crea un nuevo pathpoint
     * @param id orden del pathpoint en la ruta
     * @param ZLatitude latitud global del punto
     * @param XLongitude longitud global del punto
     * @param YAltitude  altura del punto en metros
     * @param task (optional)id de la tarea asociadaa ese punto | 0: none | 1: photo | 2: video | 3: interval photo | 4: panoramic |
     * @param instruction (optional)instruccion asociada a la tarea panoramica | 
     */
    constructor(public ID: number,                
                public XLongitude: number,
                public ZLatitude: number,
                public YAltitude: number,
                public task: number = 0,
                public instruction: string ='' )
    {
        
    }

    getId():number {
        return this.ID;
    }

    setId(pId: number){
        this.ID = pId;
    }

    getZLatitude():number{
        return this.ZLatitude;
    }

    setZLatitude(pZLatitude: number){
        this.ZLatitude = pZLatitude;
    }

    getXLongitude():number{
        return this.XLongitude;
    }

    setpXLongitude(pXLongitude: number){
        this.XLongitude = pXLongitude;
        return this.YAltitude;
    }

    setYAltitudez(pYAltitude: number) {
        this.YAltitude = pYAltitude;
    }

    getTask(){
        return this.task;
    }

    setTask(pTask: number) {
        this.task = pTask;
    }
    

    getInstruction(){
        return this.instruction;
    }

    setInstruction(pInstruction: string){
        this.instruction = pInstruction;
    }

    toString():string{
        return `waypoint:${this.ID} |  lat:${this.ZLatitude} | lng:${this.XLongitude} | alt:${this.YAltitude} | task:${this.task} | instruction: ${this.instruction}|`
    }
    
}


