import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Path } from 'src/app/classes/path.class';
import { PathPoint } from '../../classes/pathpoint.class';
import { RoutesService } from '../../services/data.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent implements OnInit {

 


  //centro del mapa por defecto si 
  centerLatitude: number = 4.6011985;
  centerLongitude: number = -74.0657539;


  //el id debe ser auto generado: traer toda la lista de Ids y hacer +1 desde el ultimo ID (MAX)
  id: string = '';

  //objeto para representar el plan de ruta que esta siendo creado o editado
  path: Path = new Path();

  //listado de marcadores que guarda puntos que entiende el componente de mapas
  //debe tener siempre la misma informacion que la lista de waypoints del path actual y viceversa
  currentPathGoogle: google.maps.LatLngLiteral[] = [];



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
   * salvar los datos de campos y enviar al servicio el objeto a escribir
   * @param form 
   */
  save(form: NgForm) {
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



    //this.id = 'PATH-' + this.id;
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
