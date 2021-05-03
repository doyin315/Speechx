import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AudioRecordingService} from './services/audio-recording.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import {HttpClientModule} from '@angular/common/http';
import { SpeechRecogService } from '../app/services/speech-recog-service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
    
  ],
  providers: [AudioRecordingService, SpeechRecogService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
