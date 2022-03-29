import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathsComponent } from './pages/paths/paths.component';
import { PathComponent } from './pages/path/path.component';


const routes: Routes =[
  { path: 'paths', component: PathsComponent},
  { path: 'path/:id', component: PathComponent},  
  { path: '**', pathMatch: 'full', redirectTo: 'paths'}
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
