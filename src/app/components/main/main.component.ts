import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {AudioRecordingService} from '../../services/audio-recording.service';
import { from } from 'rxjs';
import {SpeechRecogService } from '../../services/speech-recog-service';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FaceRecogntionService } from 'src/app/services/face-recogntion.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

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
  valid = false;
  

  constructor(private audioRecordingService: AudioRecordingService,
              private sanitizer: DomSanitizer,
              public speechRecogService: SpeechRecogService,
              private toastr:ToastrService,
              public faceService:FaceRecogntionService ) {
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

    this.speechRecogService.source.subscribe(val=>{
      console.log(val)
      console.log(val.includes('start'));
      if(val){
        if(val.includes('start')){
          this.toastr.success('Engine has started!!!')
      }
      else if(val.includes('stop')){
        this.toastr.error('Engine has stopped!!!')
    } else{
      this.toastr.warning('We do not understand- Please Try again.')
    }
    
      }
    
  })
  }

  ngOnDestroy() {
    this.speechRecogService.DestroySpeechObject()
  }

  ngOnInit(): void {
   
    
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
          // console.log(res.result, res);
    }, error => {
      console.log(error.message);
      this.toastr.error("An Error Ocurred");
    });
    });
  }

  doToast(){
    console.log("toast")
    this.toastr.success("Working")
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
          if(res.result=="Accept"){
            console.log('toastr success')
            this.toastr.success("Authentication Successful!!!");
            this.valid = true
          }
          else{
            this.toastr.error("Authentication Failed. Invalid User!");
          }
        
    }, error => {
      console.log(error.message);
      this.toastr.error("An Error Ocurred");
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
    this.valid = false;
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
            // console.log(value);
            // console.log(value.includes('start'))
        },
        //errror
        (err) => {
            console.log(err);
            if (err.error == "no-speech") {
                console.log("--restatring service--");
                // this.activateSpeechSearchMovie();
            }
        },
        //completion
        () => {
            this.showSearchButton = true;
            console.log("--complete--");
            // this.activateSpeechSearchMovie();
        });
}

endRecord(){
  this.speechRecogService.DestroySpeechObject();
}

processFile(img){
 
  const file: File =img.files[0];


  let data = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))

  let url = window.URL.createObjectURL(file)
  this.faceService.getBlob(url)
  .subscribe(res=>{

  }, err=>{

  })
}
getImage(){
  this.faceService.getBlob("assets/pic1.jpg").subscribe(
    res=>{
      console.log('ress',res)
    },
    err=>{
      console.log(err)
    }
  )
}

faceVerify(){

  this.faceService.verifyFace().subscribe(
    (res: any)=>{
      console.log('ress',res)

      let total=0

      for (let i=0; i<res.length; i++){
        total= total + res[i].confidence
      }

      console.log('total',total)

      let ave = total/res.length
      console.log('ave',ave)
      if(total>=0.5){
        this.toastr.success("Valid Face")
      }
      else{
        this.toastr.error('Invalid face');
      }
    },
    err=>{
      console.log(err)
    }
  )
}

}
