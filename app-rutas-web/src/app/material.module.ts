import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Importaciones para usar componentes de Material
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  //requiere exports pues es un modulo personalizado y sin esto no serian visibles a otros componentes
  exports:[
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatStepperModule
  ]
})
export class MaterialModule { }
