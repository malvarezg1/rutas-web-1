import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getBytes, getStorage, listAll, ref } from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { storage } from 'firebase-admin';

/**
 * Servicio para solicitar informacion desde la base de datos de rutas
 */
@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  constructor(private storage: AngularFireStorage) {}

  private imagesRefernece = this.storage.ref('prueba');

  private videosRefernece = this.storage.ref('videos');


  listImages() {
    return this.imagesRefernece.listAll();
  }

  listVideos() {
    return this.videosRefernece.listAll();
  }

  getImage(name: String) {
    return this.storage.ref('prueba/' + name).getDownloadURL();
  }

  getVideo(name: String) {
    return this.storage.ref('videos/' + name).getDownloadURL();
  }
}
