
import { Component } from '@angular/core';
import { Path } from './classes/path.class';
import { PathPoint } from './classes/pathpoint.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  
  title = 'app-rutas-web';

  currentPath: Path;
  currentPathGoogle: google.maps.LatLngLiteral[] = [];
  
  

  constructor(){            

    this.currentPath = new Path(0, `PATH-${0}`,[]);   
       
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
    let point = this.currentPath.getWaypoints()[id];
    point.setYAltitudez(height);
    this.currentPath.editPathPoint(id,point);
    //hay que actualizar el arreglo de puntos que entiende google: sincronizarlos
    this.updateGooglePath();
  }

  /**
   * sincroniza el arreglo de Puntos del Path actual con el arreglo de puntos que entiende google
   */
  updateGooglePath(){
    
    for (let index = 0; index < this.currentPath.getWaypoints.length; index++) {
      let currentPoint = this.currentPath.getWaypoints()[index];
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
