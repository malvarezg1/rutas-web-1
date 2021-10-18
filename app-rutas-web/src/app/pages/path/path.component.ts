import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Path } from 'src/app/classes/path.class';
import { PathPoint } from '../../classes/pathpoint.class';
import { RoutesService } from '../../services/data.service';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent implements OnInit {




  //el id debe ser auto generado: traer toda la lista de Ids y hacer +1 desde el ultimo ID (MAX)
  id: string = '';

  //objeto para representar el plan de ruta que esta siendo creado o editado
  path: Path = new Path();

  //listado de marcadores que guarda puntos que entiende el componente de mapas
  //debe tener siempre la misma informacion que la lista de waypoints del path actual y viceversa
  currentPathGoogle: google.maps.LatLngLiteral[] = []; 



  constructor(private routesService: RoutesService) {

    //TODO asignar el id automaticamente
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
      this.path.addPathPoint(newPathPoint);        
      console.log(this.path.toString());   
    }
  
    /**
     * 
     * @param height : altura nueva para el pathpoint
     * @param id : id del pathpoint a editar su altura
     */
    editWaypointHeigth(height: number, id: number){
      let point = this.path.PATH[id];
      point.YAltitude=height;
      this.path.editPathPoint(id,point);   
    }
  
    /**
     * sincroniza el arreglo de Puntos del Path actual con el arreglo de puntos que entiende google
     */
    updateGooglePath(){
      
      for (let index = 0; index < this.path.PATH.length; index++) {
        let currentPoint = this.path.PATH[index];
        let googlePoint = new google.maps.LatLng(currentPoint.ZLatitude, currentPoint.XLongitude);
        this.currentPathGoogle.push(googlePoint.toJSON());      
      }
         
    }








  /**
   * salvar los datos de campos y enviar al servicio el objeto a escribir
   * @param form 
   */
  save(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario no valido')
    }

    this.id = 'PATH-' + this.id;
    this.routesService.crearPath(this.path, this.id)
      .subscribe(resp => console.log(resp));

    console.log(form);
    console.log(this.path)
  }




















  //map options
  options = {
    center: { lat: 40.7461773, lng: -74.0089399 },
    zoom: 18,
    heading: 99,
    tilt: 90,
    mapId: '1a4a81d1fb3cd3f' //id que permite usar el estilo de edificios 3D

  } as google.maps.MapOptions;

}
