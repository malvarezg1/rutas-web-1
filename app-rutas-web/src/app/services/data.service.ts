import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Path } from '../classes/path.class';
import { PathPoint } from '../classes/pathpoint.class';


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

        //el id debe venif de la forma 'PATH-#' 
        return this.http.put(`${this.url}/${id}.json`, jsonObj);
    }

    getIds(){

    }

    
}