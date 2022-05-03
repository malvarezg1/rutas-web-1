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
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';



//Modulos propios
import { MaterialModule } from './material.module';

//Firebase
import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire/compat/";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
//import { AngularFireStorageModule } from '@angular/fire/compat/storage';


@NgModule({
  declarations: [
    AppComponent,
    PathComponent,
    PathsComponent,
    GalleryComponent,
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {



}
