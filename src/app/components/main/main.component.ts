import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {AudioRecordingService} from '../../services/audio-recording.service';
import { from } from 'rxjs';
import {SpeechRecogService } from '../../services/speech-recog-service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy {
  isRecording = false;
  recordedTime;
  blobUrl;
  showSearchButton;
  speechData;
  

  constructor(private audioRecordingService: AudioRecordingService,
              private sanitizer: DomSanitizer,
              public speechRecogService: SpeechRecogService ) {
    this.showSearchButton = false
    this.speechData = '';
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      console.log(this.blobUrl);
    });
  }

  ngOnDestroy() {
    this.speechRecogService.DestroySpeechObject()
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
  send() {
    this.audioRecordingService.getBlob(this.blobUrl).subscribe((data) => {
      console.log('get blob', data);
      this.audioRecordingService.sendAudio(data).subscribe(
        res => {
          console.log('Success', res);
    }, error => {
      console.log(error.message);
    });
    });
  }

  getVerifyId() {
    this.audioRecordingService.getVerificationProfile().subscribe(
      res => {
        console.log(res);
      }
    );
  }
  verifyEnrollment() {
    this.audioRecordingService.getBlob(this.blobUrl).subscribe((data) => {
      console.log('get blob', data);
      this.audioRecordingService.VerificationEnrollment(data).subscribe(
        res => {
          console.log('Success', res);
    }, error => {
      console.log(error.message);
    });
    });
  }
  getPhrases() {
    this.audioRecordingService.getPhraseList()
    .subscribe(res => {
      console.log(res);
    });
  }

  verify() {
    this.audioRecordingService.getBlob(this.blobUrl).subscribe((data) => {
      console.log('get blob', data);
      this.audioRecordingService.verifyAudio(data).subscribe(
        res => {
          console.log('Success', res);
    }, error => {
      console.log(error.message);
    });
    });
  }

  status() {
    this.audioRecordingService.getStatus().subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    });
  }
  clearRecordedData() {
    this.blobUrl = null;
  }

  SpeechTotext(){
    this.speechRecogService.record().subscribe()
  }

  
  activateSpeechSearchMovie(): void {
    this.showSearchButton = false;

    this.speechRecogService.record()
        .subscribe(
        //listener
        (value) => {
            this.speechData = value;
            console.log(value);
            console.log(value.includes('start'))
        },
        //errror
        (err) => {
            console.log(err);
            if (err.error == "no-speech") {
                console.log("--restatring service--");
                this.activateSpeechSearchMovie();
            }
        },
        //completion
        () => {
            this.showSearchButton = true;
            console.log("--complete--");
            this.activateSpeechSearchMovie();
        });
}

endRecord(){
  this.speechRecogService.DestroySpeechObject();
}



}
