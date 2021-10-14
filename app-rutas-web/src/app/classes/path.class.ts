import { PathPoint } from './pathpoint.class';
/**
 * Clase que representa la planeacion de una ruta
 */


export class Path{    

    constructor(private id:number,
                private description: string = `from extended - default description for PATH-${id}`,
                private path: PathPoint[]=[],
                 ){}
    
    public getId(): number{
        return this.id;
    }

    public getDescription(): string{
        return this.description;
    }

    public setDescription(pDescription:string){
        this.description = pDescription;
    }

    public getWaypoints(): PathPoint[]{
        return this.path;
    }

    
    /**
     * agreaga un pathpoint al final de la ruta
     * @param newPathPoint : nuevo pathpoint a agregar al final
     */
    public addPathPoint(newPathPoint: PathPoint){
        this.path.push(newPathPoint);
    }

    /**
     * 
     * @param i indice del pathpoint a retornar
     * @returns el pathpoint el la posicion i del arreglo
     */
    public getPathPoint(i: number): PathPoint{
        return this.path[i];
    }

    /** 
     * @param i : posiscion donde esta el pathpoint a editar
     * @param newWaypoint : pathpoint  a insertar en path[i]
     */
    public editPathPoint(i: number, newWaypoint: PathPoint){
        this.path[i] = newWaypoint;
    }

    /**
     * elimina el pathpoint de la posicion i
     * @param i posicion a eliminar
     */
    public removePathPoint(i: number){
        this.path.splice(i,1);
    }

    public toString(): string{
        let str = "";
        for (let index = 0; index < this.path.length; index++) {
            str += this.path[index].toString() + "\n";            
        }
        str += "________________________________________";
        return str;        
    }
        
}