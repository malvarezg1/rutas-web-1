import { Component, OnInit } from '@angular/core';
import { MultimediaService } from '../../services/multimedia.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paths',
  templateUrl: './gallery.component.html',
  styleUrls: [ './gallery.component.css']

})
export class GalleryComponent implements OnInit {

  constructor(
    private multiService: MultimediaService,
    private sanitizer:DomSanitizer,
    private router: Router) { }

  public image!: SafeUrl;
  public images = new Array<SafeUrl>();

  ngOnInit(): void {

    this.multiService.listImages().then(res=>{
      console.log(res)
      res.items.forEach(element => {
        this.displayImage(element.name)
      });
    })
  }

    displayImage(name: String){
      this.multiService.getImage(name).then(resp =>{
        let  string64b = this.arrayBufferToBase64(resp)
        let  url  = this.sanitize("data:image/jpg;base64, " +string64b)
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

    btnClick =  () => {
      this.router.navigateByUrl('/analysis');
};

}

