import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MultimediaService } from '../../services/multimedia.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
const EXIF = require('exif-js');
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import {ExifParserFactory} from "ts-exif-parser";
import { Image } from 'src/app/classes/image.class';
import { Marker } from 'src/app/classes/marker.class';



@Component({
  selector: 'app-paths',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']

})
export class GalleryComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _renderer2: Renderer2,

    private router: Router,
    //private multiService: MultimediaService,
    private sanitizer: DomSanitizer) { }

  public script = false;
  public image!: SafeUrl;
  public images = new Array<Image>();
  public markers = new Array<Marker>();

  /*
  async fetchData(): Promise<void> {
    this.multiService.listImages().then(res => {
      res.items.forEach(element => {
        this.displayImage(element.name)
      });
    });
  }
  */

  ngOnInit(): void {
    /*let promesa = this.fetchData();

    promesa.then(res => {
      console.log("TERMINO TODO!")
    })*/
  }
  /*
  displayImage(name: String) {
    this.multiService.getImage(name).then(resp => {

      //Save Latitrudes and Logitudes
      const Data = ExifParserFactory.create(resp).parse();

      //Lat
      let lat = Data.tags!.GPSLatitude as number ;

      //Long
      let long = Data.tags!.GPSLongitude  as number;
      let marker = new Marker(lat, long)
      this.markers.push(marker)
      

      let string64b = this.arrayBufferToBase64(resp)
      let url = this.sanitize("data:image/jpg;base64," + string64b)
      let img = new Image(url, name)
      this.images.push(img)
    })
  }
 
  
  arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
*/
  btnClick =  (id: String) => {
      this.router.navigateByUrl('/analysis/'+id)  ;
  };
   
}

