import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../services/data.service';
import { Path } from '../../classes/path.class';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paths',
  templateUrl: './paths.component.html',
  styleUrls: []

})
export class PathsComponent implements OnInit {


  // Lista de rutas recuperadas de la base de datos para esta pagina
  paths: Path[] = [];

  // Lista de ids | ya que los objetos Path no tienen el atributo id,
  // el metodo get del servicio tambien manda una lsita de ids
  ids: string[] = [];

  //Para mostrar timepo de carga de rutas (solo fines esteticos)
  loading = true;

  constructor(private dataService: RoutesService) { }


  ngOnInit(): void {


    // Inicializa el arreglo de rutas
    this.dataService.getPaths()
      .subscribe(resp => {
        let respuesta: any = resp;
        this.ids = respuesta[0];// en esta posicion hay un arreglo de ids
        this.paths = respuesta[1];// en esta posicion hay un arreglo de objetos tipo Path
        this.loading = false; // deja de mostrar la animacion de carga
        console.log(this.ids);
        console.log(this.paths);
      })

  }

  deletePath(path: Path, id: string){


    if(parseInt(id.split('-')[1]) >=98){ //no quiero borrar registros antiguos creados con VR app

      Swal.fire({ // dialogo de confirmacion para eliminar un path
        title: 'DELETE CONFIRMATION?',
        text: `are you sure you want to remove the ${id} from the database`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton:true
      }).then( resp =>{
        if(resp.value){

          //borra de la base de datos
          this.dataService.deletePath(id).subscribe();

          //borra de la lista local
          let index = this.ids.indexOf(id);
          this.paths.splice(index,1);
          this.ids.splice(index,1);
        }
      });



    }


  }

  integerParser(str: string){
    return parseInt(str);
  }

}
