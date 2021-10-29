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
export class PathComponent implements OnInit {


  @ViewChildren(MapInfoWindow) infoWindowsView: QueryList<MapInfoWindow> = new QueryList;

  

  
  

  //centro del mapa por defecto si se esta creando una ruta nueva
  centerLatitude: number = 4.6011985;
  centerLongitude: number = -74.0657539;


  //el id debe ser auto generado: traer toda la lista de Ids y hacer +1 desde el ultimo ID (MAX)
  id: string = '';

  //objeto para representar el plan de ruta que esta siendo creado o editado
  path: Path = new Path();

  //listado de marcadores que guarda puntos que entiende el componente de mapas
  //debe tener siempre la misma informacion que la lista de waypoints del path actual y viceversa
  currentPathGoogle: google.maps.LatLngLiteral[] = [];

  markerOptions: google.maps.MarkerOptions[] = [];

  //test para ver si con un arreglo es suficiente
  cameraTasks: number[] = []

  // //areglos de 0 y 1
  // shotTasks: number[] = []; //1 donde se toma foto | 0 donde no

  // // 1 donde inicia | 2 donde termina | 0 in betwen(no puede haber fotos o intervalos)
  // videoTasks: number[] = []; 

  // // 1 donde se toma panoramica | 0 donde no
  
  // panoramicTasks: number[] = []; 
  
  // // numero de segundos donde inicia | -numero de segundos donde acaba  | 0 in between ()
  // intervalTasks: number[] = []; 






  constructor(private routesService: RoutesService,
    private url: ActivatedRoute) {


    const idUrl = this.url.snapshot.paramMap.get('id') + "";

    if (idUrl === 'new') {// si la pagina actual tiene id = new
      this.routesService.getNextId()//obtenemos un nnumero libre para id
      .subscribe(resp => {

        this.id = 'PATH-' + resp;


      });

    } else {//si por el contrario hay un parametro id en el url

      this.id = idUrl;//trabajamos con el id que viene

      

      //traemos el objeto Path con ese id de la base de datos
      this.routesService.getPath(this.id)
        .subscribe((resp: Path) => {

          this.path = resp;

          
          

          console.log(`LATITUD PRIMER PUNTO ${this.path.PATH[0].ZLatitude}`);
          console.log(`LONGITUD PRIMER PUNTO ${this.path.PATH[0].XLongitude}`);
          

          
          this.options.center={lat: this.path.PATH[0].ZLatitude, lng:this.path.PATH[0].XLongitude}

          

          console.log(this.path);
          console.log(this.currentPathGoogle);

          this.updateGooglePath();
        });

      }



    

    

  }






  ngOnInit(): void {
  
  }


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
 * agrega un 
 * @param event evento e click sobre el mapa que guarda la latitud y longitud
 */
  addWaypoint(event: google.maps.MapMouseEvent) {
    this.currentPathGoogle.push(event.latLng.toJSON());

    let ZLatitude = event.latLng.lat();
    let XLongitude = event.latLng.lng();
    let newPathPoint = new PathPoint(this.currentPathGoogle.length - 1, ZLatitude, XLongitude, 10, 0, "");
    this.path.addPathPoint(newPathPoint);
    this.cameraTasks.push(0);
    console.log(this.path.toString());
  }

  /**
   * 
   * @param height : altura nueva para el pathpoint
   * @param id : id del pathpoint a editar su altura
   */
  editWaypointHeigth(height: number, id: number) {
    let point = this.path.PATH[id];
    point.YAltitude = height;
    this.path.editPathPoint(id, point);
  }

  /**
   * sincroniza el arreglo de Puntos del Path actual con el arreglo de puntos que entiende google
   */
  updateGooglePath() {

    for (let index = 0; index < this.path.PATH.length; index++) {
      let currentPoint = this.path.PATH[index];
      let googlePoint = new google.maps.LatLng(currentPoint.ZLatitude, currentPoint.XLongitude);
      this.currentPathGoogle.push(googlePoint.toJSON());
    }

  }

  

  /**
   * 
   * @param index the index of the pathpoint 
   * @param type 1 camera, 2 video, 3 panorama, 4 
   */
  markTask(index:number, type:number){

  }



  /**
   * salvar los datos de campos y enviar al servicio el objeto a escribir
   * @param form 
   */
  save(form: NgForm) {



    this.path.PATH[0].task = 1;
    this.path.PATH[1].task = 1;
    this.path.PATH[2].task = 3;
    
    //aqui hacer validaciones de tareas y valores de los campos

    if (form.invalid) {
      console.log('Formulario no valido')
    }


    Swal.fire({
      title: 'Wait...',
      text: 'Saving route info',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let request: Observable<any>;



    
    request = this.routesService.putPath(this.path, this.id);

    request.subscribe(resp => {
      Swal.fire({
        title: this.id,
        text: 'ruta guardada correctamente',
        icon: 'success'

      });

    })
    // console.log(form);
    // console.log(this.path)
  }


  options = {
    center: { lat: this.centerLatitude, lng: this.centerLongitude },
    zoom: 20,
    heading: 99,
    tilt: 90,
    mapId: '1a4a81d1fb3cd3f' //id que permite usar el estilo de edificios 3D

  } as google.maps.MapOptions;



















  

}
