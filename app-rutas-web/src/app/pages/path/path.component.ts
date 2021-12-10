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
import { takeLast, delay } from 'rxjs/operators';


@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent {


  //lista de identificadores para elementos MapInfoWindow
  @ViewChildren(MapInfoWindow) infoWindowsView: QueryList<MapInfoWindow> = new QueryList;

  
  //atributo de opciones para el mapa | estilo y id de mapa de la cuenta Imagine uniandes
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

  
  //lista de marcadores intermedios no interactivos que sirven como guia de recorrido entre waypoints
  guidePathGoogle: google.maps.LatLngLiteral[] = [];

  
  //lista de configuracion de los marcadores intermedios segun su altura 
  guideMarkerOptions: google.maps.MarkerOptions[] = [];


  //lista de alturas para los marcadores intermedios elevados
  alturasIntermedias: number[] =[]; 

  //atrubuto para saber el nombre de la tarea actual durante simulacion
  currentSimulationTask : Task = this.tasks[0];// do nothing by default
  
  nowSimulating = false;
  

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
 * @param event evento click sobre el mapa que guarda la latitud y longitud
 */
  addWaypoint(event: google.maps.MapMouseEvent) {   


     // 10m por default
     let altura = 10;      

     //configurar la altura delmarcador segun altura del punto
     let markerConfig = {
       //draggable: true,
       anchorPoint: new google.maps.Point(0, -altura*3.4),// -y proporcional a la altura *3 o 3.5 más o menos    
       animation: google.maps.Animation.DROP, // solo cuando se agreag se hace esta animacion
       optimized: true,
       icon: {
         path: this.getSvgPathMarker(altura),
         strokeColor: "#000000",
         strokeWeight: 3,
         scale: 6,
         labelOrigin: new google.maps.Point(0, -(altura+2.4))//-(alturaSVG +2.5       
       }
     }

    
     //se agreag el punto a ambas representaciones
    //Waypoint Google
    this.markerOptions.push(markerConfig);
    this.currentPathGoogle.push(event.latLng.toJSON());    
    //Waypoint logico
    let ZLatitude = event.latLng.lat();
    let XLongitude = event.latLng.lng();
    let nextPoint = new PathPoint(this.currentPathGoogle.length - 1, ZLatitude, XLongitude, altura, '0', "");
    this.path.PATH.push(nextPoint);



    //calcular marcadores intermedios
    if(this.path.PATH.length > 1){//si hay almenos dos marcadores en el mapa
       

    let copy_path = this.path.PATH;
    let currentPoint = copy_path[copy_path.length -2];// penultimo marcador    

    //penultimo punt
    let punto_1 = new google.maps.LatLng(currentPoint.ZLatitude, currentPoint.XLongitude);
    //ounto recien agregado
    let punto_2 = new google.maps.LatLng(nextPoint.ZLatitude, nextPoint.XLongitude);

        //distancia en metros de los dos puntos
        let distance = this.getDistance(punto_1,punto_2);                  

        //la distancia y la diferencia de altura tambien son los dos factores para definir la variacion progresiva de altura de los iconos
        let dif_altura = Math.abs(currentPoint.YAltitude - nextPoint.YAltitude);

        //usar la distancia como un factor para calcular el numero de iconos elevados a generar           
        let numIconos = Math.round((distance+dif_altura)*0.25);//.25 es un factor de distribucion 

        //arreglo con puntos de tipo google.maps.LatLng
        let puntos = this.getPuntosIntermedios(numIconos, punto_1, punto_2);     
       
        // cero:0 si las alturas son iguales, 1 si sube y -1 si deciende
        let direccion = currentPoint.YAltitude < nextPoint.YAltitude? 1 : currentPoint.YAltitude > nextPoint.YAltitude? -1: 0 ;

        //avance en el cambio de altura
        let delta = Math.round(dif_altura/numIconos) * direccion;
       

        let alturaOrigen = currentPoint.YAltitude;   
        
        for (let k = 0; k < puntos.length; k++) {
          
          this.guidePathGoogle.push(puntos[k].toJSON());    
          
          //configuracion del marcador agregado

          let str =  `M 0 -${alturaOrigen} L 0.25 -${alturaOrigen} M 0 -${alturaOrigen} L 0 -${alturaOrigen + 0.25} M 0 -${alturaOrigen} L 0 -${alturaOrigen-0.25} M 0 -${alturaOrigen} L -0.25 -${alturaOrigen}`;      

          let intermediateMarkerConfig = {
            //draggable: true
            anchorPoint: new google.maps.Point(0, -alturaOrigen*3.4),// -y proporcional a la altura *3 o 3.5 más o menos            
            optimized: true,
            icon: {
              path: str,
              strokeColor: "#7a7a7a",
              strokeWeight: 1,
              scale: 6                   
            }            
          }

          this.guideMarkerOptions.push(intermediateMarkerConfig);
          this.alturasIntermedias.push(alturaOrigen);
          alturaOrigen += delta;//siempre se suma por que el delta lleva el signo asociado a la direccion
               
        }
        //agregar ultimo punto a los marcadores, para que se vea en la simulacion         
        let lastGooglePoint = new google.maps.LatLng(nextPoint.ZLatitude, nextPoint.XLongitude);
        this.guidePathGoogle.push(lastGooglePoint.toJSON());

        alturaOrigen = nextPoint.YAltitude;
        let last_str_path =  `M 0 -${alturaOrigen} L 0.25 -${alturaOrigen} M 0 -${alturaOrigen} L 0 -${alturaOrigen + 0.25} M 0 -${alturaOrigen} L 0 -${alturaOrigen-0.25} M 0 -${alturaOrigen} L -0.25 -${alturaOrigen}`;      

          let last_intermediateMarkerConfig = {
            //draggable: true
            anchorPoint: new google.maps.Point(0, -alturaOrigen*3.4),// -y proporcional a la altura *3 o 3.5 más o menos            
            optimized: true,
            icon: {
              path: last_str_path,
              strokeColor: "#ff00ff",
              strokeWeight: 1,
              scale: 6                   
            }            
          }
          this.guideMarkerOptions.push(last_intermediateMarkerConfig);
          this.alturasIntermedias.push(nextPoint.YAltitude);




      }
      else{//hay solo un marcador
        //agregar como marcador intermedio el punto recien agregado
        let firstGooglePoint = new google.maps.LatLng(nextPoint.ZLatitude, nextPoint.XLongitude);
        this.guidePathGoogle.push(firstGooglePoint.toJSON());


        let alturaOrigen = nextPoint.YAltitude;
        let first_str_path =  `M 0 -${alturaOrigen} L 0.25 -${alturaOrigen} M 0 -${alturaOrigen} L 0 -${alturaOrigen + 0.25} M 0 -${alturaOrigen} L 0 -${alturaOrigen-0.25} M 0 -${alturaOrigen} L -0.25 -${alturaOrigen}`;      

          let first_intermediateMarkerConfig = {
            //draggable: true
            anchorPoint: new google.maps.Point(0, -alturaOrigen*3.4),// -y proporcional a la altura *3 o 3.5 más o menos            
            optimized: true,
            icon: {
              path: first_str_path,
              strokeColor: "#ff00ff",
              strokeWeight: 1,
              scale: 6                   
            }            
          }
          this.guideMarkerOptions.push(first_intermediateMarkerConfig);
          this.alturasIntermedias.push(nextPoint.YAltitude);





      }   
    
    
  }

  /**
   * 
   * @param height : altura nueva para el pathpoint
   * @param id : id del pathpoint a editar su altura
   */
  editWaypointHeigth(id: number, height: number) {
    let point =this.path.PATH[id]
    this.path.PATH[id] = new PathPoint(id, point.ZLatitude, point.XLongitude, height, point.task, point.instruction);
    this.guideMarkerOptions = [];
    this.guidePathGoogle = [];
    this.alturasIntermedias = [];
    this.updateGooglePath();    
  }

  deleteWaypoint(id: number){
    this.path.PATH.splice(id,1); //revisar metodo redimencionar, hay que ajustar ids del arreglo despues de eliminar un elemento inicial o intermedio
    for (let index = 0; index < this.path.PATH.length; index++)
      this.path.PATH[index].ID = index;
    
    this.currentPathGoogle = []
    this.guidePathGoogle = []
    this.markerOptions = []
    this.alturasIntermedias = []
    this.guideMarkerOptions = []    
    this.updateGooglePath();
  }



  /**
   * sincroniza el arreglo de Puntos del Path actual con respectp al arreglo de marcadores y confuguracion que entiende google 
   */
  updateGooglePath() {
    
    let currentPathGoogleAux: google.maps.LatLngLiteral[] = [];
    this.currentPathGoogle = currentPathGoogleAux;

    let markerOptionsAux: google.maps.MarkerOptions[] = [];
    this.markerOptions = markerOptionsAux;


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

      let markerConfig = {
        //draggable: true, //not supported yet 
        anchorPoint: new google.maps.Point(0, -altura*3.2),// -y proporcional a la altura *3 o 3.5 más o menos    
        optimized: true,
        icon: {
          path: this.getSvgPathMarker(altura),
          strokeColor: svgColor,
          strokeWeight: 3,
          scale: 6,
          labelOrigin: new google.maps.Point(0, -(altura+2.2))//-(alturaSVG +2.5       
        }
      }
      this.markerOptions.push(markerConfig);
      let googlePoint = new google.maps.LatLng(currentPoint.ZLatitude, currentPoint.XLongitude);
      this.currentPathGoogle.push(googlePoint.toJSON());


      //crean marcadores guia entre el punto actual y el siguiente
      //TODO: optimizar codigo: muchas variables intermedias
      //evitar creacion de variables dentro de los loops y reutilzar informacion entre iteraciones
      //simplificar calculos y reutilzar referencais a valores usados varias veces
      if(index != this.path.PATH.length -1 ){ // si no es el ultimo

        let nextPoint = this.path.PATH[index+1];

        let punto_1 = new google.maps.LatLng(currentPoint.ZLatitude, currentPoint.XLongitude);
        let punto_2 = new google.maps.LatLng(nextPoint.ZLatitude, nextPoint.XLongitude);

        //distancia en metros de los dos puntos
        let distance = this.getDistance(punto_1,punto_2);              
              

        //la distancia y la diferencia de altura tambien son los dos factores para definir la variacion progresiva de altura de los iconos
        let dif_altura = Math.abs(currentPoint.YAltitude - nextPoint.YAltitude);

        //usar la distancia como un factor para calcular el numero de iconos elevados a generar
        //let numIconos = Math.round(distance/3);//¿por cada 3 mestros hay un icono?        
        let numIconos = Math.round((distance+dif_altura)*0.25);

        let puntos = this.getPuntosIntermedios(numIconos, punto_1, punto_2);  
       
        // 0 si las alturas son iguales, 1 si sube y -1 si deciende
        let direccion = currentPoint.YAltitude < nextPoint.YAltitude? 1 : currentPoint.YAltitude > nextPoint.YAltitude? -1: 0 ;

        //avance en el cambio de altura
        let delta = Math.round(dif_altura/numIconos) * direccion;
       
        let alturaOrigen = currentPoint.YAltitude;   
        

        //agrefar el punto 1 a la lista de puntos intermedios
        let firstGooglePoint = new google.maps.LatLng(currentPoint.ZLatitude, currentPoint.XLongitude);
        this.guidePathGoogle.push(firstGooglePoint.toJSON());       
          
          //configuracion del marcador agregado
          let str =  `M 0 -${alturaOrigen} L 0.25 -${alturaOrigen} M 0 -${alturaOrigen} L 0 -${alturaOrigen + 0.25} M 0 -${alturaOrigen} L 0 -${alturaOrigen-0.25} M 0 -${alturaOrigen} L -0.25 -${alturaOrigen}`;      
          let intermediateMarkerConfig = {
            //draggable: true
            anchorPoint: new google.maps.Point(0, -alturaOrigen*3.4),// -y proporcional a la altura *3 o 3.5 más o menos            
            optimized: true,
            icon: {
              path: str,
              strokeColor: "#ff00ff",
              strokeWeight: 1,
              scale: 6                   
            }
            
          }
          this.guideMarkerOptions.push(intermediateMarkerConfig);
          this.alturasIntermedias.push(currentPoint.YAltitude);



        //agregar resto de puntos intermedios
        for (let k = 0; k < puntos.length; k++) {

          this.guidePathGoogle.push(puntos[k].toJSON());    
          
          //configuracion del marcador agregado

          let str =  `M 0 -${alturaOrigen} L 0.25 -${alturaOrigen} M 0 -${alturaOrigen} L 0 -${alturaOrigen + 0.25} M 0 -${alturaOrigen} L 0 -${alturaOrigen-0.25} M 0 -${alturaOrigen} L -0.25 -${alturaOrigen}`;      

          let intermediateMarkerConfig = {
            //draggable: true
            anchorPoint: new google.maps.Point(0, -alturaOrigen*3.4),// -y proporcional a la altura *3 o 3.5 más o menos            
            optimized: true,
            icon: {
              path: str,
              strokeColor: "#7a7a7a",
              strokeWeight: 1,
              scale: 6                   
            }
            
          }

          this.guideMarkerOptions.push(intermediateMarkerConfig);

          this.alturasIntermedias.push(alturaOrigen);
          alturaOrigen += delta;     
     
          
        }
      }
      else{//si es el ultimo

        let nextPoint =  this.path.PATH[this.path.PATH.length -1];
        let lastGooglePoint = new google.maps.LatLng(nextPoint.ZLatitude, nextPoint.XLongitude);
        this.guidePathGoogle.push(lastGooglePoint.toJSON());

        let alturaOrigen = nextPoint.YAltitude;
        let last_str_path =  `M 0 -${alturaOrigen} L 0.25 -${alturaOrigen} M 0 -${alturaOrigen} L 0 -${alturaOrigen + 0.25} M 0 -${alturaOrigen} L 0 -${alturaOrigen-0.25} M 0 -${alturaOrigen} L -0.25 -${alturaOrigen}`;      

          let last_intermediateMarkerConfig = {
            //draggable: true
            anchorPoint: new google.maps.Point(0, -alturaOrigen*3.4),// -y proporcional a la altura *3 o 3.5 más o menos            
            optimized: true,
            icon: {
              path: last_str_path,
              strokeColor: "#ff00ff",
              strokeWeight: 1,
              scale: 6                   
            }            
          }
          this.guideMarkerOptions.push(last_intermediateMarkerConfig);
          this.alturasIntermedias.push(nextPoint.YAltitude);


      }

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
   * inicia
   * @param index 
   */
  async startSimulation(index: number){

    this.nowSimulating = true

    if(index < this.alturasIntermedias.length){//si es un id valido

      
      let markerColor = "#000000";
      if(this.currentSimulationTask != this.tasks[2] && this.currentSimulationTask != this.tasks[3]){
        this.currentSimulationTask = this.tasks[0];
      }

      let googlePoint = this.guidePathGoogle[index];
      for (let index = 0; index < this.path.PATH.length; index++) {
        let waypointelement = this.path.PATH[index];
        if(googlePoint.lat == waypointelement.ZLatitude && googlePoint.lng == waypointelement.XLongitude){  
          

          if(this.currentSimulationTask == this.tasks[2] && parseInt(waypointelement.task) == 2){
            this.currentSimulationTask == this.tasks[0]; //stop video recording
          }else{
            this.currentSimulationTask = this.tasks[parseInt(waypointelement.task)]
          }     
          
          

        }else{
          
            
          
        }
      }
      
      
      if(index>=1){//quitar el icono anterior

        let alturaAnterior = this.alturasIntermedias[index-1];

        let str =  `M 0 -${alturaAnterior} L 0.25 -${alturaAnterior} M 0 -${alturaAnterior} L 0 -${alturaAnterior + 0.25} M 0 -${alturaAnterior} L 0 -${alturaAnterior-0.25} M 0 -${alturaAnterior} L -0.25 -${alturaAnterior}`;      

        let intermediateMarkerConfig = {
          //draggable: true
          anchorPoint: new google.maps.Point(0, -alturaAnterior*3.4),// -y proporcional a la altura *3 o 3.5 más o menos            
          optimized: true,
          icon: {
            path: str,
            strokeColor: "#7a7a7a",
            strokeWeight: 1,
            scale: 6                   
          }
          
        }

        this.guideMarkerOptions[index-1] = intermediateMarkerConfig

      }

      let delay = 500;
     
      if(this.currentSimulationTask == this.tasks[1]){
          markerColor = "#0800ff";//blue photo
          delay = 800;
      }else if(this.currentSimulationTask == this.tasks[2]){
          markerColor = "#a10000";
          delay = 1000;
      }else if(this.currentSimulationTask == this.tasks[3]){
          markerColor = "#1b9410";
          delay = 1000;         
      }else if(this.currentSimulationTask == this.tasks[4]){
          markerColor = "#bfa900";
          delay = 2000;
      }


      let intermediateMarkerConfig: google.maps.MarkerOptions = {
        //draggable: true
        anchorPoint: new google.maps.Point(0, -this.alturasIntermedias[index]*3.4),// -y proporcional a la altura *3 o 3.5 más o menos            
        optimized: true,
        icon: {
          path: this.getSVGdrone(this.alturasIntermedias[index]),
          strokeColor: markerColor,
          strokeWeight: 5,
          scale: 6            
        }
        
      }

      this.guideMarkerOptions[index] = intermediateMarkerConfig;

      function sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
  
      console.log("inicia espera")
      await sleep(delay);
      console.log("inicia espera")
 
      index++;
      //llamado recursivo para cambiar los iconos siguientes
      this.startSimulation(index);
      if(index == this.alturasIntermedias.length){      

        await sleep(1000);
        alert("Simulacion finalizada");
        this.nowSimulating = false;           
        this.updateGooglePath();

      }
    }    
  }

  

  /**
   * formato para el label del slider que modifica la altura de un waypoint
   * @param value 
   * @returns 
   */
  formatLabel(value: number){
    return value + 'm';
  }

  /**
   * configurar la altura delmarcador segun altura del punto
   * @param altura
   * @returns svgPathSymbol
   */
   getSvgPathMarker(altura: number){    
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

    console.log(svgPath);
    return svgPath;

  }

  getSVGdrone(altura: number):string{
    return `M -1 -${altura} Q 0 -${altura+1} 1 -${altura} Q 0 -${altura+1} 2 -${altura+1} Q 0 -${altura+1} -2 -${altura+1} Q 0 -${altura+1} -1 -${altura}`
    //return `M 0 -${altura} Q 0 -${altura+1} 1 -${altura+1} Q 0 -${altura+1} 0 -${altura+2} Q 0 -${altura+1} -1 -${altura+1} Q 0 -${altura+1} 0 -${altura}`;
  }


  /**
   * convierte de grados a radianes
   * @param x angul oen grados
   * @returns angulo en radianes
   */
  rad(x:number) {
    return x * Math.PI / 180;
  };
  
  /**
   * distancia entre dos puntos del globo terraqueo
   * @param p1 punto 1
   * @param p2 punto 2
   * @returns distancia en metros del punto 1 al punto 2
   */
  getDistance(p1: google.maps.LatLng , p2: google.maps.LatLng) {
    var R = 6378137; // radio aproximado de la tierra
    var dLat = this.rad(p2.lat() - p1.lat());//diferencia de latitudes
    var dLong = this.rad(p2.lng() - p1.lng());//diferencia de longitudes
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; //distancia en metros
  };

  
  /**
   * retorna un numero de puntos LatLng ente dos puntos espedificos
   * puntos extremos no inclusivos
   * @param cantidad cantidad de puntos intermedios a calcular
   * @param punto1 
   * @param punto2
   * @returns arreglo de puntos LatLng de tamanio <cantidad>
   */
  getPuntosIntermedios(cantidad: number,                       
                       punto1: google.maps.LatLng,
                       punto2: google.maps.LatLng)
                       :google.maps.LatLng[]{

    //pendiente de la funcion
    let m = (punto2.lng() - punto1.lng())/(punto2.lat() - punto1.lat());
    
    let newLng = (pLat:number) => {
      // y(x) = m(x - x0) + y0
      return m*(pLat-punto1.lat()) + punto1.lng()
    }

    let puntos = new Array<google.maps.LatLng>();

    let difLat = punto2.lat() - punto1.lat();

    let avance = difLat/(cantidad + 1);

    let newLat = punto1.lat();
    for (let k = 0; k < cantidad; k++) {
      newLat += avance;
      puntos.push(new google.maps.LatLng(newLat, newLng(newLat)));            
    }  

    return puntos;

  }

}


interface Task {
  value: string;
  viewValue: string;
}