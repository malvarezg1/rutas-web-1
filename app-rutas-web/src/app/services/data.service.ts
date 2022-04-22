import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Path } from '../classes/path.class';
import { PathPoint } from '../classes/pathpoint.class';
import { map, delay } from 'rxjs/operators';


/**
 * Servicio para solicitar informacion desde la base de datos de rutas
 */
@Injectable({
    providedIn: 'root'
})
export class RoutesService {

    //direccion de la base de datos
    private url = 'https://drone-control-app.firebaseio.com';

    constructor(private http: HttpClient){}

    /**
     * crea/actualza un path de id especificado
     * @param path objeto que representa el plan de ruta
     * @param id identificador para guardarlo
     * @returns response: del resultado de la operacion
     */
    putPath(path: Path, id: string){

        let jsonObj:any = {description: "", PATH: {} };

        //objeto tipo json con nombres de atributos acorde al esquema actual
        jsonObj.description = path.description + "";
        for(let i = 0; i < path.PATH.length; i++){
            var pointName = 'PATHPOINT-' + i;
            var point: PathPoint = path.PATH[i];
            jsonObj.PATH[pointName]=point;
        }

        //el id debe venir de la forma 'PATH-#'
        //es put pues nosotros queremos definir el id (autcalculado) y no el que asigna firebase a un nuevo registro (POST)
        return this.http.put(`${this.url}/${id}.json`, jsonObj)
        .pipe(
            map( (resp:any) => {
                return id;
            })
        );

    }


    /**
     * Elimina en la base de datos una ruta de id especificado
     * @param id identificador del id a eliminar
     * @returns
     */
    deletePath(id: string){
        return this.http.delete(`${this.url}/${id}.json`);
    }


    /**
     * retorna un objeto de tipo path que este representado en la base de datos como un registro de id especifuicado
     * @param id id del objeto a buscar
     * @returns el objeto con id especificado | un path vacio si no lo encuentra
     */
    getPath(id: string){
       let path: Path = new Path();
       return this.http.get(`${this.url}/${id}.json`)
                   .pipe(
                       map(this.buildPath)
                   )
    }

    /**
     * desde un objeto Json construye un objeto Path para que cumpla con su estructura
     * @param pathObj
     * @returns
     */
    private buildPath(pathObj: any){
        let path: Path = pathObj;
        //copia de la referencia al arreglo de puntos tipo Object
        let pointsObj: any = path.PATH;

        //arreglo donde se guardaran los puntos tipo PathPoint
        let waypoints_i: PathPoint[] = []

        Object.keys(pointsObj).forEach(pointKey =>{
            //asignacion directa pues los nombres de campos coinciden
            let point:PathPoint = pointsObj[pointKey];
            waypoints_i.push(point);
        });

        //re asigna el arreglo de pathpoints
        path.PATH = waypoints_i;

        return path;

    }


    /**
     * devuelve toda la lista de paths de la base de datos
     * @returns una lista de ids y uina lista de path
     * ambas listas se corresponden entre si
     * ids[i] es el indice o identificador para el path[i]
     */
    getPaths(){
        let paths: Path[] = [];
        return this.http.get(`${this.url}/.json`)
                    .pipe(
                        map(this.buildArray),
                        delay(800)// solo con el fin de ver que carga
                    );

    }

    /**
     * Metodo soporte apra contruir el arreglo de respuesta a un GET de todas las rutas
     * @param pathsObj objeto json que devuelve firebase lista de PATH
     * @returns un arreglo con ids y objetos Path
     */
    private buildArray(pathsObj: any){

        //en la posicion 0 de este arreglo hay un arreglo de keys o ids the rutas
        //en la posicion 1 de este arreglo hay un arreglo de objetos tipo ruta
        let resp: Object[] = [];


        //arreglo para guardar todos los paths: Path
        let paths: Path[] = [];

        //arreglo para guardar el correspondiente ID del path (porque no es un campo en la clase)
        let ids: string[] = [];



        //si no hay ningun registro retora una arreglo vacio
        if(pathsObj === null) return [];

        Object.keys(pathsObj).forEach(key => {

            //en este punto cada objeto tiene un arreglo PATH de Objetcs que representan puntos
            //se necesita reescribir ese arreglo para que sus elementos sean de tipo PathPoint
            //consoloe.log(path_i.PATH[0].alguna propíedad) deberia dar error pues no esta mapeado correctamente
            let path_i: Path = pathsObj[key];

            //copia de la referencia al arreglo de puntos tipo Object
            let pointsObj: any = path_i.PATH;

            //arreglo donde se guardaran los puntos tipo PathPoint
            let waypoints_i: PathPoint[] = []

            Object.keys(pointsObj).forEach(pointKey =>{
                //asignacion directa pues los nombres de campos coinciden
                let point:PathPoint = pointsObj[pointKey];
                waypoints_i.push(point);
            });

            //re asigna el arreglo de pathpoints
            path_i.PATH = waypoints_i;


            //agregar el path al arreglo de paths
            paths.push(path_i);

            //agregar el id al arreglo de ids
            ids.push(key);




        });
        //agregar ids y paths al arreglo respuesta
        resp.push(ids);//resp[0]
        resp.push(paths);//resp[1]

        return resp;
    }



    /**
     * Regresa el siguiente id libre para usar
     * @returns number. con un id que no exista previamente
     */
     getNextId(){
        let paths: Path[] = [];
        return this.http.get(`${this.url}/.json`)
                    .pipe(
                        map(this.getMaxIdFromArray)
                    );
    }



    /**
     * Metodo soporte para calcular el id libre
     * @param pathsObj objeto json con la respuesta del get
     * @returns un id libre que se puede usar para crear una nuevo path sin conflictos
     */
    private getMaxIdFromArray(pathsObj: any){

        let resp: number = -1;

        //si no hay ningun registro retora una arreglo vacio
        if(pathsObj === null) return -1;

        Object.keys(pathsObj).forEach(key => {

            //key:string es de la forma 'PATH-#'
            //Debemos extraer el #
            key = key.split('-')[1];
            let current_id = parseInt(key);

            if(current_id > resp) resp = current_id
        });

        return resp + 1;
    }


    //retorna un string con la ciudad y nombre de sector donde esta el primer waypoint del path con ese id
    getCityPath(id:string){
        //TODO
    }

}


