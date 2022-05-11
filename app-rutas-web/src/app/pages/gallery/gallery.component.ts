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
  constructor(
    private router: Router,
    private multiService: MultimediaService,
  ) {}

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
      let video = new Video(res, name);
      this.videos.push(video);

      /*
      fetch(video.url)
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
          
        });*/
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

  btnClick = (id: String) => {
    this.router.navigateByUrl('/analysis/' + id);
  };
}
