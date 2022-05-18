import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathsComponent } from './pages/paths/paths.component';
import { PathComponent } from './pages/path/path.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';
import { HomeComponent } from './pages/home/home.component';


const routes: Routes =[
  { path: 'home', component: HomeComponent},
  {path: 'gallery', component:GalleryComponent },
  { path: 'analysis/:source/:id', component: AnalysisComponent},
  { path: 'paths', component: PathsComponent},
  { path: 'path/:id', component: PathComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
