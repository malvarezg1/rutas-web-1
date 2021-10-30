import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Importacion de librerias/modulos externos
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//Componentes 
import { PathComponent } from './pages/path/path.component';
import { PathsComponent } from './pages/paths/paths.component';
import { SimulationComponent } from './pages/simulation/simulation.component';



//Modulos propios
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    AppComponent,
    PathComponent,
    PathsComponent,
    SimulationComponent,
    
  ],
  imports: [
    BrowserModule,    
    GoogleMapsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  

}
