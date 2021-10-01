import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-rutas-web';

  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 4;

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng.toJSON());
  }

  options = {
    center: {lat: 4.6088585, lng: -74.0744161 },
    zoom: 20,
    heading: 320,
    tilt: 47.5,
    mapId: '1a4a81d1fb3cd3f'
    
  } as google.maps.MapOptions;


   


  


}
