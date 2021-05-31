import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { FacialComponent } from './components/facial/facial.component';
import { MainComponent } from './components/main/main.component';


const routes: Routes = [
  {path:'index', component: FacialComponent},
  {path:'face', component: FacialComponent},
  {path:'emotion', component: MainComponent},
  {path:'**', redirectTo:'/index', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
