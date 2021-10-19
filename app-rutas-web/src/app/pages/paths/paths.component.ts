import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../services/data.service';
import { Path } from '../../classes/path.class';

@Component({
  selector: 'app-paths',
  templateUrl: './paths.component.html'

})
export class PathsComponent implements OnInit {



  paths: Path[] = [];

  ids: string[] = [];

  constructor(private dataService: RoutesService) { }

  ngOnInit(): void {
   this.dataService.getPaths()
     .subscribe(resp => {
       let respuesta: any = resp;
       this.ids = respuesta[0];
       this.paths = respuesta[1];

       console.log(this.ids);
       console.log(this.paths);
     })
       

    


  }

}
