import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AnalysisList } from '../classes/analysisList.class';

/**
 * Servicio para solicitar informacion desde la base de datos de rutas
 */
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  getAnalysis(id: string) {
    return this.firestore
      .doc<AnalysisList>('Analyzed_Media/DJI4-21-2022, 10:00:03 PM')
      .get();
  }
}
