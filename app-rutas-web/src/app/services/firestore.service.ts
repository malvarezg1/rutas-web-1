import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


/**
 * Servicio para solicitar informacion desde la base de datos de rutas
 */
 @Injectable({
  providedIn: 'root'
})
export class FirestoreService{


  constructor(private http: HttpClient){}


}


