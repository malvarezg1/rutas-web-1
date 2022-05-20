import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AnalysisList } from 'src/app/classes/analysisList.class';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-paths',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent implements OnInit {
  private idUrl!: string;
  private sourceUrl!: string;

  public imageUrl!: SafeUrl;
  public videoUrl!: SafeUrl;
  public isImage: boolean = true;
  public personCount!: number;


  public analysis!: AnalysisList;


  @ViewChild("videoPlayer", { static: false }) videoplayer!: ElementRef;

  constructor(
    private url: ActivatedRoute,
    private multiService: MultimediaService,
    private sanitizer: DomSanitizer,
    private firestore: FirestoreService
  ) {
    this.idUrl = this.url.snapshot.paramMap.get('id') + '';
    this.sourceUrl = this.url.snapshot.paramMap.get('source') + ''
  }

  // Get image and display on screen
  displayImage(source : string , name: string) {
    this.multiService.getImageAnalysis(source,name).subscribe((res) => {
      this.imageUrl = res;
    });
  }

    // Get video and display on screen
  displayVideo(source : string , name: string) {
    this.multiService.getVideoAnalysis(source, name).subscribe((res) => {
      this.videoUrl = res;
      console.log(this.videoUrl)
    });
  }

  // Get shapes of person count
  fetchAnalysis(id : string){
    this.firestore.getAnalysis(id).subscribe((res) => {
      this.analysis = res.data()!;
      console.log(this.analysis.persons );
    });
  }

  btnPersonsCount(){
    if(this.sourceUrl =="video"){
      this.displayVideo("videosPersonas", this.idUrl)
      this.isImage = false;
    }
    else{
      this.displayImage("personas", this.idUrl)
      this.fetchAnalysis(this.idUrl.replace('.jpg', ''))
    }
  }

  toggleVideo(){
    this.videoplayer.nativeElement.play();
  }


  ngOnInit(): void {
    if(this.sourceUrl =="video"){
      this.displayVideo("videos",this.idUrl);
      this.isImage = false;
    }
    else{
      this.displayImage("images", this.idUrl);
    }
  }
}
