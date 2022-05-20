import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MultimediaService } from '../../services/multimedia.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';

import {MatTabsModule} from '@angular/material/tabs';

const EXIF = require('exif-js');
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ExifParserFactory } from 'ts-exif-parser';
import { Image } from 'src/app/classes/image.class';
import { Video } from 'src/app/classes/video.class';

import { Marker } from 'src/app/classes/marker.class';

@Component({
  selector: 'app-paths',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {

    //atributo de opciones para el mapa | estilo y id de mapa de la cuenta Imagine uniandes
    options: google.maps.MapOptions = {mapId: 'c7ed31fb07967124'} as google.maps.MapOptions;



  constructor(
    private router: Router,
    private multiService: MultimediaService,
  ) {
            // centramos el mapa con respecto al primer pathpoint de la ruta
            this.options = {
              center: { lat: 0, lng: 0 },
              zoom: 1.5, // zoom especifico
              heading: 99,
              tilt: 90
              //el mapID ya esta en las opciones por defecto
            } as google.maps.MapOptions;
  }

  public script = false;
  public markers = new Array<Marker>();

  public image!: SafeUrl;
  public images = new Array<Image>();

  public video!: SafeUrl;
  public videos = new Array<Video>();




  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    //Imagenes
    this.multiService.listImages().subscribe((res) => {
      res.items.forEach((element) => {
        this.displayImage(element.name);
      });
    });

    //Videos
    this.multiService.listVideos().subscribe((res) => {
      res.items.forEach((element) => {
        this.displayVideo(element.name);
      });
    });
  }

  //Display Video
  displayVideo(name: string) {
    this.multiService.getVideo(name).subscribe((res) => {

      this.multiService.getThumbnail(name).subscribe((data) => {
        let video = new Video(res, name, data);
        this.videos.push(video);
      });
    });
  }


  //Display Image
  displayImage(name: string) {
    this.multiService.getImage(name).subscribe((res) => {
      let img = new Image(res, name);
      this.images.push(img);

      fetch(img.url)
        .then((res) => res.arrayBuffer())
        .then((res) => {
          //Save Latitrudes and Logitudes
          const Data = ExifParserFactory.create(res).parse();

          //Lat
          let lat = Data.tags!.GPSLatitude as number;

          //Long
          let long = Data.tags!.GPSLongitude as number;
          let marker = new Marker(lat, long);
          this.markers.push(marker);
        });
    });
  }

  btnImageClick = (id: String) => {
    this.router.navigateByUrl('/analysis/image/' + id);
  };

  btnVideoClick = (id: String) => {
    this.router.navigateByUrl('/analysis/video/' + id);
  };
}
