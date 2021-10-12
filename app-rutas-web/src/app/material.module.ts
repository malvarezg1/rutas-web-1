import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Importaciones para usar componentes de Material
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  //requiero exports pues es un modulo personalizado y sin esto no serian visibles sus componentes
  exports:[
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule
  ]
})
export class MaterialModule { }
