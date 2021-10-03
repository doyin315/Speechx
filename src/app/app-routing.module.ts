import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { FacialComponent } from './components/facial/facial.component';
import { MainComponent } from './components/main/main.component';
import { VoiceComponent } from './components/voice/voice.component';
import { AuthService } from './services/auth.service';


const routes: Routes = [
  {path:'index', component: BaseComponent},
  {path:'face', component: FacialComponent},
  {path:'voice', component: VoiceComponent},
  {path:'main', component: MainComponent , canActivate: [AuthService]},
  {path:'**', redirectTo:'/index', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
