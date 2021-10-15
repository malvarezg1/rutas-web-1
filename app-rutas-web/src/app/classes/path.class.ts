import { PathPoint } from './pathpoint.class';
/**
 * Clase que representa la planeacion de una ruta
 */


export class Path {    

    constructor(public id:number,
                public description: string = `web:default description for PATH-${id}`,
                public path: PathPoint[]=[])
    {
        
    }
    
       
    /**
     * agreaga un pathpoint al final de la ruta
     * @param newPathPoint : nuevo pathpoint a agregar al final
     */
    addPathPoint(newPathPoint: PathPoint){
        this.path.push(newPathPoint);
    }

    /**
     * obtiene el pathpoint en la posicion i
     * @param i indice del pathpoint a retornar
     * @returns el pathpoint el la posicion i del arreglo
     */
    getPathPoint(i: number): PathPoint{
        return this.path[i];
    }

    /** 
     * edita el pathpoint en la posicion i
     * @param i : posiscion donde esta el pathpoint a editar
     * @param newWaypoint : pathpoint  a insertar en path[i]
     */
    editPathPoint(i: number, newWaypoint: PathPoint){
        this.path[i] = newWaypoint;
    }

    /**
     * elimina el pathpoint de la posicion i
     * @param i posicion a eliminar
     */
    removePathPoint(i: number){
        this.path.splice(i,1);
    }

    /** 
     * @returns una representacion de la ruta
     */
    toString(): string{
        let str = "";
        for (let index = 0; index < this.path.length; index++) {
            str += this.path[index].toString() + "\n";            
        }
        str += "________________________________________";
        return str;        
    }
        
}

