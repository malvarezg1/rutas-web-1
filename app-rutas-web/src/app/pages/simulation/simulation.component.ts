import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Path } from 'src/app/classes/path.class';
import { RoutesService } from 'src/app/services/data.service';
import { PathPoint } from '../../classes/pathpoint.class';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {



  //el id debe ser auto generado: traer toda la lista de Ids y hacer +1 desde el ultimo ID (MAX)
  id: string = '';

  //objeto para representar el plan de ruta que esta siendo creado o editado
  path: Path = new Path();



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


    this.id = idUrl;//trabajamos con el id que viene



    //traemos el objeto Path con ese id de la base de datos
    this.routesService.getPath(this.id)
      .subscribe((resp: Path) => {

        this.path = resp;
        console.log(`LATITUD PRIMER PUNTO ${this.path.PATH[0].ZLatitude}`);
        console.log(`LONGITUD PRIMER PUNTO ${this.path.PATH[0].XLongitude}`);
        console.log(this.path);

      });









  }






  ngOnInit(): void {

  }











}
