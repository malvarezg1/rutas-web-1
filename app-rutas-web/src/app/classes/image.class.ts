import { SafeResourceUrl } from '@angular/platform-browser';


export class Image {    
    constructor(
      public url: SafeResourceUrl,
      public name: String
    ) { }
  }