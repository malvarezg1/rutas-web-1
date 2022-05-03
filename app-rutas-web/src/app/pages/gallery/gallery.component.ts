import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MultimediaService } from '../../services/multimedia.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as EXIF from 'exif-js';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-paths',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']

})
export class GalleryComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _renderer2: Renderer2,

    private multiService: MultimediaService,
    private sanitizer: DomSanitizer) { }
  
  public script = false;
  public image!: SafeUrl;
  public images = new Array<SafeUrl>();
  

  async fetchData(): Promise<void>{
    this.multiService.listImages().then(res => {
      res.items.forEach(element => {
        this.displayImage(element.name)
      });
    });
  }


  ngOnInit(): void {
    let promesa = this.fetchData();

    promesa.then(res =>{
      console.log("TERMINO TODO!")
    })
  }


  ejemplo(): void{
    console.log("ENTROO !!!!!")
    if(this.script == false){
      this.script = true;
      //Script
      let script = this._renderer2.createElement('script');
      script.text = `
      {
          document.getElementById("the-img").onclick = function() {
          
            EXIF.getData(this, function() {
      
                myData = this;
      
                console.log(myData.exifdata);
            });
        }
      }
      `;
      this._renderer2.appendChild(this.document.body, script);
    }
  }


  displayImage(name: String) {
    this.multiService.getImage(name).then(resp => {

      let string64b = this.arrayBufferToBase64(resp)
      let url = this.sanitize("data:image/jpg;base64, " + string64b)
      this.images.push(url)
    });
        

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

}

