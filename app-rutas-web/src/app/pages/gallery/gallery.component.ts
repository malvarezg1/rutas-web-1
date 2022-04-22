import { Component, OnInit } from '@angular/core';
import { MultimediaService } from '../../services/multimedia.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-paths',
  templateUrl: './gallery.component.html',
  styleUrls: []

})
export class GalleryComponent implements OnInit {

  constructor(
    private multiService: MultimediaService,
    private sanitizer:DomSanitizer) { }

  public image!: SafeUrl;
  public images!: Array<SafeUrl>;

  ngOnInit(): void {
    this.multiService.getImage("DJI4-21-2022, 10:00:03 PM").then(resp =>{
      console.log(resp)
      let  string64b = this.arrayBufferToBase64(resp)
      console.log(string64b)
      let  url  = this.sanitize("data:image/jpg;base64, " +string64b)
      console.log(url)
      this.image = url
    })

    /*
    this.multiService.listImages().then(res=>{
      res.items.forEach(element => {
        console.log(element.name)
        this.displayImage(element.name)
      });
    })
    */
  }

    displayImage(name: String){
      this.multiService.getImage(name).then(resp =>{
        console.log(resp)
        let  string64b = this.arrayBufferToBase64(resp)
        console.log(string64b)
        let  url  = this.sanitize("data:image/jpg;base64, " +string64b)
        console.log(url)
        this.image = url
        this.images.push(url)
      })
    }

    arrayBufferToBase64( buffer: ArrayBuffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
         binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    }

    sanitize( url:string ) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }

}

