import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FirestoreService } from 'src/app/services/firestore.service';
import { AnalysisList } from 'src/app/classes/analysisList.class';

@Component({
  selector: 'app-paths',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent implements OnInit {
  private idUrl!: string;
  public imageUrl!: SafeUrl;
  private analysis!: AnalysisList;

  constructor(
    private url: ActivatedRoute,
    private multiService: MultimediaService,
    private sanitizer: DomSanitizer,
    private firestore: FirestoreService
  ) {
    this.idUrl = this.url.snapshot.paramMap.get('id') + '';
  }

  displayImage(name: string) {
    this.multiService.getImageAnalysis('personas',name).subscribe((res) => {
      this.imageUrl = res;
    });
  }

  ngOnInit(): void {
    this.displayImage(this.idUrl);
    let id = this.idUrl.replace('.jpg', '');
    this.firestore.getAnalysis(id).subscribe((res) => {
      this.analysis = res.data()!;
      console.log(this.analysis.persons);
    });
  }
}
