

export class PathPoint{   

    constructor(private id: number,
                private ZLatitude: number,
                private XLongitude: number,
                private YAltitude: number,
                private task: number = 0,
                private instruction: string = ''
    ){}

    public getId():number {
        return this.id;
    }

    public setId(pId: number){
        this.id = pId;
    }

    public getZLatitude():number{
        return this.ZLatitude;
    }

    public setZLatitude(pZLatitude: number){
        this.ZLatitude = pZLatitude;
    }

    public getXLongitude():number{
        return this.XLongitude;
    }

    public setpXLongitude(pXLongitude: number){
        this.XLongitude = pXLongitude;
        return this.YAltitude;
    }

    public setYAltitudez(pYAltitude: number) {
        this.YAltitude = pYAltitude;
    }

    public getTask():number{
        return this.task;
    }

    public setTask(pTask: number) {
        this.task = pTask;
    }
    

    public getInstruction():string{
        return this.instruction;
    }

    public setInstruction(pInstruction: string){
        this.instruction = pInstruction;
    }

    public toString():string{
        return `waypoint:${this.id} |  lat:${this.ZLatitude} | lng:${this.XLongitude} | alt:${this.YAltitude} | task:${this.task} | instruction: ${this.instruction}|`
    }
    
}