import { Component, OnInit,  } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-paths',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
  ){ }

  goToGallery(){
    this.router.navigateByUrl('gallery');
  }

  goToPaths(){
    this.router.navigateByUrl('paths');
  }

  ngOnInit(): void {

  }

}

