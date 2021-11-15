import { Component, OnInit,  ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Path } from 'src/app/classes/path.class';
import { PathPoint } from '../../classes/pathpoint.class';
import { RoutesService } from '../../services/data.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {MapInfoWindow, MapMarker} from '@angular/google-maps';
import { QueryList } from '@angular/core';


@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent {


  //lista de identificadores para elementos MapInfoWindow
  @ViewChildren(MapInfoWindow) infoWindowsView: QueryList<MapInfoWindow> = new QueryList;

  
  //atributo de opciones para el mapa | estilo y id de mapa de la cuenta Imagine
  options: google.maps.MapOptions = {mapId: 'c7ed31fb07967124'} as google.maps.MapOptions;


  //centro de vista general de la ciudad de Bogotá
  //centro del mapa por defecto si se esta creando una ruta nueva
  centerLatitude: number = 4.6491878;
  centerLongitude: number = -74.1335378;


  //el id debe ser auto generado: el servicio busac un id libre para asignar
  // o el id vien como parametro en el url de la ruta
  id: string = '';

  //objeto para representar el plan de ruta que esta siendo creado o editado
  path: Path = new Path();


  //Opciones de tareas para los diferentes pathpoints
  //value es lo que se guarda como atrubuto
  //viewValue es lo que se muestra en pantalla y representa el valor 
  tasks: Task[] = [
    {value: '0', viewValue: 'do nothing'},
    {value: '1', viewValue: 'Take Picture'},
    {value: '2', viewValue: 'Start video'},
    {value: '3', viewValue: 'Start interval'},
    {value: '4', viewValue: 'Take Panorama Picture'}
  ];

  //listado de marcadores que guarda puntos que entiende el componente de mapas
  //debe tener siempre la misma informacion que la lista de waypoints del path actual y viceversa
  currentPathGoogle: google.maps.LatLngLiteral[] = [];


  //lista para configurar los diferentes marcadores segun sus respectivos atrubutos PathPoint
  markerOptions: google.maps.MarkerOptions[] = [];

  
  
  

  constructor(private routesService: RoutesService,
              private url: ActivatedRoute) {


    //obtener el id desde la url, puede ser new o PATH-#
    const idUrl = this.url.snapshot.paramMap.get('id') + "";

    if (idUrl === 'new') {// si la pagina actual tiene id = new
      this.routesService.getNextId()//obtenemos un numero libre para id desde el servicio
        .subscribe(resp => {

          this.id = 'PATH-' + resp;

        });

      // se ubica el mapa sobre una vista general de bogota
      this.options = {
        center: { lat: this.centerLatitude, lng: this.centerLongitude },
        zoom: 11, //zoom general
        heading: 99,
        tilt: 90,
        //id que permite usar el estilo de edificios 3D
        mapId: 'c7ed31fb07967124'  
        //por alguna razon hay que volverlo a poner sino no funciona
      } as google.maps.MapOptions;

    } else {//si por el contrario hay un parametro id en el url

      this.id = idUrl;//trabajamos con el id que viene     

      //traemos el objeto Path con ese id de la base de datos
      this.routesService.getPath(this.id)
        .subscribe((resp: Path) => {

          this.path = resp;

          this.centerLatitude= this.path.PATH[0].ZLatitude;
          this.centerLongitude = this.path.PATH[0].XLongitude;

          // centramos el mapa con respecto al primer pathpoint de la ruta
          this.options = {
            center: { lat: this.centerLatitude, lng: this.centerLongitude },
            zoom: 21, // zoom especifico
            heading: 99,
            tilt: 90
            //el mapID ya esta en las opciones por defecto
          } as google.maps.MapOptions;

          //el arreglo de objetos marcadores del api se actualiza segun la informacion recuperada
          this.updateGooglePath();
        });
    }
  }


  /**
   * funcion para abrir el marcador clickeado de manera dinamica (no todos las ventanas tienen los mismo)
   * @param marker 
   * @param windowIndex 
   */
  openInfoWindow(marker: MapMarker, windowIndex: number) {
    let curIdx = 0;
    this.infoWindowsView.forEach((window: MapInfoWindow) => {
      if (windowIndex === curIdx) {
        window.open(marker);
        curIdx++;
      } else {
        curIdx++;
      }
    });

  }


  /**
 * agrega un waypoint al mapa y al objeto path
 * @param event evento e click sobre el mapa que guarda la latitud y longitud
 */
  addWaypoint(event: google.maps.MapMouseEvent) {

     //configurar la altura delmarcador segun altura del punto, 10m por default
     let altura = 10;      

     //Icono SVG definido por un string
     //convencion: agregar un espacio al final de cada modificacion al svg
     let svgPath = ""; //inicia en el punto (0, 0)


     //linea punteada
     let i = 0;

     while (i < altura) {
       svgPath += `M 0 -${i++} V -${i++} `; //dibuja una linea desde la ubicacion anterior (M 0 x) hasta (0 , i)
     }
     svgPath += `M 0 -${altura}`;
     //agregar punta de marcador
     svgPath += `L 2 -${altura + 2} L 0 -${altura + 4} L -2 -${altura + 2} L 0 -${altura}`;



     let markerConfig = {
       draggable: true,
       anchorPoint: new google.maps.Point(0, -altura*3.4),// -y proporcional a la altura *3 o 3.5 más o menos    
       animation: google.maps.Animation.DROP, // solo cuando se agreag se hace esta animacion
       optimized: true,
       icon: {
         path: svgPath,
         strokeColor: "#000000",
         strokeWeight: 3,
         scale: 6,
         labelOrigin: new google.maps.Point(0, -(altura+2.4))//-(alturaSVG +2.5       
       }
     }

    
     //se agreag el punto a ambas representaciones

    //waypint de google
    this.markerOptions.push(markerConfig);
    this.currentPathGoogle.push(event.latLng.toJSON());

    //Waypoint logico
    let ZLatitude = event.latLng.lat();
    let XLongitude = event.latLng.lng();
    let newPathPoint = new PathPoint(this.currentPathGoogle.length - 1, ZLatitude, XLongitude, 10, '0', "");
    this.path.PATH.push(newPathPoint);
    
  }

  /**
   * 
   * @param height : altura nueva para el pathpoint
   * @param id : id del pathpoint a editar su altura
   */
  editWaypointHeigth(id: number, height: number) {
    let point =this.path.PATH[id]
    this.path.PATH[id] = new PathPoint(id, point.ZLatitude, point.XLongitude, height, point.task, point.instruction);
    this.updateGooglePath()
  }

  /**
   * sincroniza el arreglo de Puntos del Path actual con respectp al arreglo de marcadores y confuguracion que entiende google
   */
  updateGooglePath() {
    console.log('updateGooglePath')
    let currentPathGoogleAux: google.maps.LatLngLiteral[] = []
    this.currentPathGoogle = currentPathGoogleAux
    let markerOptionsAux: google.maps.MarkerOptions[] = [];
    this.markerOptions = markerOptionsAux
    for (let index = 0; index < this.path.PATH.length; index++) {
      let currentPoint = this.path.PATH[index];
      console.log(currentPoint.YAltitude)

      //configurar color segun tarea
      let svgColor = "#000000";//negro para waypoints sin tareas
      if(currentPoint.task == '1') svgColor = "blue";
      if(currentPoint.task == '2') svgColor = "red";
      if(currentPoint.task == '3') svgColor = "green";
      if(currentPoint.task == '4') svgColor = "yellow";
      //configurar la altura delmarcador segun altura del punto
      let altura = currentPoint.YAltitude;      
      //convencion: agregar un espacio al final de cada modificacion al svg
      let svgPath = ""; //inicia en el punto (0, 0)
      //linea punteada
      let i = 0;
      while (i < altura) {
        svgPath += `M 0 -${i++} V -${i++} `; //dibuja una linea desde la ubicacion anterior (M 0 x) hasta (0 , i)
      }
      svgPath += `M 0 -${altura}`;
      //agregar punta de marcador
      svgPath += `L 2 -${altura + 2} L 0 -${altura + 4} L -2 -${altura + 2} L 0 -${altura}`;



      let markerConfig = {
        draggable: true,
        anchorPoint: new google.maps.Point(0, -altura*3.2),// -y proporcional a la altura *3 o 3.5 más o menos    
        optimized: true,
        icon: {
          path: svgPath,
          strokeColor: svgColor,
          strokeWeight: 3,
          scale: 6,
          labelOrigin: new google.maps.Point(0, -(altura+2.2))//-(alturaSVG +2.5       
        }
      }
      this.markerOptions.push(markerConfig);
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
      alert("el formulario tiene campos invalidos")
    }


    //cuadro de dialogo que muestra el progreso de la operacion
    Swal.fire({
      title: 'Wait...',
      text: 'Saving route info',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    let request: Observable<any>;
    
    //hacer un put en la base de datos
    request = this.routesService.putPath(this.path, this.id);

    //cuadro de dialogo que confirma el exito de la oparacion
    request.subscribe(resp => {
      Swal.fire({
        title: this.id,
        text: 'ruta guardada correctamente',
        icon: 'success'

      });

    })
    
  }


  /**
   * formato para el label del slider que modifica la altura de un waypoint
   * @param value 
   * @returns 
   */
  formatLabel(value: number) {
    return value + 'm';
  } 

}


interface Task {
  value: string;
  viewValue: string;
}