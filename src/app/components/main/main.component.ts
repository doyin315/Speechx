import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {AudioRecordingService} from '../../services/audio-recording.service';
import { from } from 'rxjs';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy {
  isRecording = false;
  recordedTime;
  blobUrl;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }
  send(){
    this.audioRecordingService.getAudio().subscribe(res =>{
      console.log(res);
      this.audioRecordingService.sendaudio(res).subscribe(
        rep => {
          console.log('Success',rep.data)
        }
      )
    }, error =>{
      console.log(error.message)
    })
  }

  status(){
    this.audioRecordingService.getStatus().subscribe(res =>{
      console.log(res)
    }, error =>{
      console.log(error)
    })
  }
  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy() {
  }

}
