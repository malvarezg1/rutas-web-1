import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MultimediaService } from '../../services/multimedia.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
const EXIF = require('exif-js');
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ExifParserFactory } from 'ts-exif-parser';
import { Image } from 'src/app/classes/image.class';
import { Marker } from 'src/app/classes/marker.class';

@Component({
  selector: 'app-paths',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _renderer2: Renderer2,

    private router: Router,
    private multiService: MultimediaService,
    private sanitizer: DomSanitizer
  ) {}

  public script = false;
  public image!: SafeUrl;
  public images = new Array<Image>();
  public markers = new Array<Marker>();


  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    this.multiService.listImages().subscribe((res) => {
      res.items.forEach((element) => {
        this.displayImage(element.name);
      });
    });
  }

  displayImage(name: string) {
    this.multiService.getImage(name).subscribe((res) => {
      let img = new Image(res, name);
      this.images.push(img);

      fetch(img.url).then((res) => res.arrayBuffer()).then((res) => {
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
