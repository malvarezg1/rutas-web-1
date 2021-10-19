import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Path } from '../classes/path.class';
import { PathPoint } from '../classes/pathpoint.class';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RoutesService {

    
    private url = 'https://drone-control-app.firebaseio.com';




    constructor(private http: HttpClient){
        
    }

    /**
     * 
     * @param path objeto que representa el plan de ruta
     * @param id identificador para guardarlo 
     * @returns response: del resultado de la operacion
     */
    crearPath(path: Path, id: string){
        let jsonObj:any = {description: "", PATH: {} };
        
        //objeto tipo json con nombres de atributos acorde al esquema actual 
        jsonObj.description = path.description + "";
        for(let i = 0; i < path.PATH.length; i++){
            var pointName = 'PATHPOINT-' + i;
            var point: PathPoint = path.PATH[i];
            jsonObj.PATH[pointName]=point;
        }

        //el id debe venir de la forma 'PATH-#' 
        //es put pues nosotros queremos definir el id (autcalculado) pero no el que asign firebase a un nuevo registro
        return this.http.put(`${this.url}/${id}.json`, jsonObj)
        .pipe(
            map( (resp:any) => {                
                return id;
            })
        );

    }


  
    getIds(){

    }

    getPaths(){
        let paths: Path[] = [];
        return this.http.get(`${this.url}/.json`)
                    .pipe(
                        map(this.buildArray)
                    );
        
    }

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

            //
            path_i.PATH = waypoints_i;
            console.log(key + ' <-> ' + path_i.toString());


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

    
}