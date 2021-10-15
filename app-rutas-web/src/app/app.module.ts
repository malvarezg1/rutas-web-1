import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Importacion de librerias/modulos externos
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//Componentes 


//Servicios

import {RoutesService} from './services/data.service';

//Modulos propios
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    MaterialModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  public a: string[] = [];

}
