import { PathPoint } from './pathpoint.class';
/**
 * Clase que representa la planeacion de una ruta
 */
export class Path {    

    /**
     * Inicializador de un objeto tipo Path
     * @param description : descripcion opcional de los que hace la ruta
     * @param PATH : listado de puntos
     */
    constructor(public description?: string,
                public PATH: PathPoint[]=[])
    {}
    
       
    /**
     * agreaga un pathpoint al final de la ruta
     * @param newPathPoint : nuevo pathpoint a agregar al final
     */
    addPathPoint(newPathPoint: PathPoint){
        this.PATH.push(newPathPoint);
    }

    /**
     * obtiene el pathpoint en la posicion i
     * @param i indice del pathpoint a retornar
     * @returns el pathpoint el la posicion i del arreglo
     */
    getPathPoint(i: number): PathPoint{
        return this.PATH[i];
    }

    /** 
     * edita el pathpoint en la posicion i
     * @param i : posiscion donde esta el pathpoint a editar
     * @param newWaypoint : pathpoint  a insertar en path[i]
     */
    editPathPoint(i: number, newWaypoint: PathPoint){
        this.PATH[i] = newWaypoint;
    }

    /**
     * elimina el pathpoint de la posicion i
     * @param i posicion a eliminar
     */
    removePathPoint(i: number){
        this.PATH.splice(i,1);
    }

    /** 
     * @returns una representacion de la ruta
     */
    toString(): string{
        let str = "";
        for (let index = 0; index < this.PATH.length; index++) {
            str += this.PATH[index].toString() + "\n";            
        }
        str += "________________________________________";
        return str;        
    }        
}