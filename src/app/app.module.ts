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
import { FacialComponent } from './components/facial/facial.component';
import { EmotionComponent } from './components/emotion/emotion.component';
import { VoiceComponent } from './components/voice/voice.component';
import { BaseComponent } from './components/base/base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FacialComponent,
    EmotionComponent,
    VoiceComponent,
    BaseComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
