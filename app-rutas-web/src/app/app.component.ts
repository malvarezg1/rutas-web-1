
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
  currentPath: Path = new Path();
  currentPathGoogle: google.maps.LatLngLiteral[] = [];  

  constructor(){            

   
       
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
    let point = this.currentPath.PATH[id];
    point.YAltitude=height;
    this.currentPath.editPathPoint(id,point);   
  }

  /**
   * sincroniza el arreglo de Puntos del Path actual con el arreglo de puntos que entiende google
   */
  updateGooglePath(){
    
    for (let index = 0; index < this.currentPath.PATH.length; index++) {
      let currentPoint = this.currentPath.PATH[index];
      let googlePoint = new google.maps.LatLng(currentPoint.ZLatitude, currentPoint.XLongitude);
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
