import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getBytes, getStorage, listAll, ref } from 'firebase/storage';

/**
 * Servicio para solicitar informacion desde la base de datos de rutas
 */
@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  private firebaseConfig = {
    projectId: 'drone-control-app',
    apiKey: 'AIzaSyDx7hHcjZVI5mWBaE6nI4cHH33zb70ARQY',
    authDomain: 'drone-control-app.firebaseapp.com',
    databaseURL: 'https://drone-control-app.firebaseio.com/',
    storageBucket: 'drone-control-app.appspot.com',
  };

  private firebaseApp = initializeApp(this.firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  private storage = getStorage(this.firebaseApp);
  private imagesRefernece = ref(this.storage, 'prueba');

  getImage(name: String){
    let multiReference = ref(this.storage, 'prueba/' + name);
    let bytes = getBytes(multiReference)
    return bytes
  }

  listImages(){
     return listAll(this.imagesRefernece)
  }

}