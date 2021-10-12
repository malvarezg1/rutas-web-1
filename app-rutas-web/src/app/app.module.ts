import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Importacion de librerias
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//COmponentes Propios
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MapComponent } from './components/map/map.component';

//Modulos propios
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    MapComponent
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
