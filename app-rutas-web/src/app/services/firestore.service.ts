import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


/**
 * Servicio para solicitar informacion desde la base de datos de rutas
 */
 @Injectable({
  providedIn: 'root'
})
export class FirestoreService{
  constructor(   private firestore: AngularFirestore   ) {}


  getShapes(){
    return this.firestore.collection("Analyzed_Media").snapshotChanges();
  }
}




