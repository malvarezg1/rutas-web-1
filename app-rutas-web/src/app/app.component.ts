
import { Component, OnInit } from '@angular/core';
import { Path } from './classes/path.class';
import { PathPoint } from './classes/pathpoint.class';
import { RoutesService } from './services/data.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  
  rutas: Path[] = [];  
  currentPath: Path;
  currentPathGoogle: google.maps.LatLngLiteral[] = [];  

  constructor(public _routesService:RoutesService){            

    this.rutas = this._routesService.getRutas();
    this.currentPath = this.rutas[0];  
       
  }

  ngOnInit(): void {
    
    
  }
  

  /**
   * agrega un 
   * @param event evento e click sobre el mapa que guarda la latitud y longitud
   */
  addWaypoint(event: google.maps.MapMouseEvent) {
    this.currentPathGoogle.push(event.latLng.toJSON());
    
    let ZLatitude = event.latLng.lat();
    let XLongitude = event.latLng.lng();
    let newPathPoint = new PathPoint(this.currentPathGoogle.length - 1, ZLatitude,XLongitude,10,0,"");
    this.currentPath.addPathPoint(newPathPoint);        
    console.log(this.currentPath.toString());   
  }

  /**
   * 
   * @param height : altura nueva para el pathpoint
   * @param id : id del pathpoint a editar su altura
   */
  editWaypointHeigth(height: number, id: number){
    let point = this.currentPath.path[id];
    point.setYAltitudez(height);
    this.currentPath.editPathPoint(id,point);
    //hay que actualizar el arreglo de puntos que entiende google: sincronizarlos
    this.updateGooglePath();
  }

  /**
   * sincroniza el arreglo de Puntos del Path actual con el arreglo de puntos que entiende google
   */
  updateGooglePath(){
    
    for (let index = 0; index < this.currentPath.path.length; index++) {
      let currentPoint = this.currentPath.path[index];
      let googlePoint = new google.maps.LatLng(currentPoint.getZLatitude(), currentPoint.getXLongitude());
      this.currentPathGoogle.push(googlePoint.toJSON());      
    }
       
  }
  
  //Opciones del mapa
  options = {
    center: {lat: 40.7461773, lng: -74.0089399 },
    zoom: 18,
    heading: 99,
    tilt: 90,
    mapId: '1a4a81d1fb3cd3f'
    
  } as google.maps.MapOptions;


}
