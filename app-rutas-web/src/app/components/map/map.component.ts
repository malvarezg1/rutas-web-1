import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  options = {
    center: {lat: 40.7461773, lng: -74.0089399 },
    zoom: 18,
    heading: 99,
    tilt: 90,
    mapId: '1a4a81d1fb3cd3f'
    
  } as google.maps.MapOptions;

}
