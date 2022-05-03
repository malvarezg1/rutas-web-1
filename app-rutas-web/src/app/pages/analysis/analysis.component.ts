import { Component, OnInit } from '@angular/core';
import { RoutesService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-paths',
  templateUrl: './analysis.component.html',
  styleUrls: [ './analysis.component.css']

})
export class AnalysisComponent implements OnInit {

  private idUrl!: String;
  public imageUrl!: SafeUrl;

  constructor(
    private url: ActivatedRoute,
    //private multiService: MultimediaService,
    private sanitizer: DomSanitizer,
    private firestore: FirestoreService,
    ) {
     this.idUrl = this.url.snapshot.paramMap.get('id') + "";

    }

    /*
    displayImage(name: String){
      this.multiService.getImage(name).then(resp =>{
        let  string64b = this.arrayBufferToBase64(resp)
        let url = this.sanitize("data:image/jpg;base64," +string64b)
        console.log(url)
        this.imageUrl = url
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
*/


  ngOnInit(): void {
   //this.displayImage(this.idUrl)
   
   console.log(this.firestore.getShapes().subscribe(res =>(console.log(res[0].payload.doc.data()))));
  }

}

