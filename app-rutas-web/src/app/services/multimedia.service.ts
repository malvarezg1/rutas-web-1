import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getBytes, getStorage, ref } from 'firebase/storage';

/**
 * Servicio para solicitar informacion desde la base de datos de rutas
 */
@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  private firebaseConfig = {
    apiKey: 'AIzaSyDx7hHcjZVI5mWBaE6nI4cHH33zb70ARQY',
    authDomain: 'drone-control-app.firebaseapp.com',
    databaseURL: 'https://drone-control-app.firebaseio.com/',
    storageBucket: 'drone-control-app.appspot.com',
  };

  private firebaseApp = initializeApp(this.firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  private storage = getStorage(this.firebaseApp);

  getImage(){
    let multiReference = ref(this.storage, 'images/DJI4-21-2022, 10:00:06 PM');
    let bytes = getBytes(multiReference)
    return bytes
  }

}
