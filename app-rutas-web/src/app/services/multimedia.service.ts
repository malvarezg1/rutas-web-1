import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';


/**
 * Servicio para solicitar informacion desde la base de datos de rutas
 */
@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  constructor(private storage: AngularFireStorage) {}

  private imagesRefernece = this.storage.ref('images');

  private videosRefernece = this.storage.ref('videos');


  listImages() {
    return this.imagesRefernece.listAll();
  }

  listVideos() {
    return this.videosRefernece.listAll();
  }

  getImage(name: String) {
    return this.storage.ref('images/' + name).getDownloadURL();
  }

  getImageAnalysis(analysis: string,name: string) {
    console.log(analysis+'/' + name)
    return this.storage.ref(analysis+'/' + name).getDownloadURL();
  }

  getVideo(name: String) {
    return this.storage.ref('videos/' + name).getDownloadURL();
  }
}
