import { Injectable, NgZone } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import {map} from 'rxjs/operators'
import { isNullOrUndefined } from 'util';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable()
export class AudioRecordingService {
constructor(public http: HttpClient){}
  body;
  private stream;
  private recorder;
  private interval;
  private startTime;
  private _recorded = new Subject<RecordedAudioOutput>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();

  operationid= 'b26c1ad8-5b38-449b-b07c-8a9d57669fb9';
  operationUrl=`https://speechx.cognitiveservices.azure.com/spid/v1.0/operations/${this.operationid}`
  identificationProfileId = '195cc4ca-20bc-4b7c-bf0e-562855a2e159';
  params = {shortAudio: true};
  apiUrl = `https://speechx.cognitiveservices.azure.com/spid/v1.0/identificationProfiles/${this.identificationProfileId}/enroll`;
  audioUrl = 'assets/audio.wav';
  options = {headers: new HttpHeaders({'Content-Type': 'multipart/form-data',
                                      'Ocp-Apim-Subscription-Key': 'ccfa90c16fe1486cb4a1a58ea7f49faf'})};

  statusOptions= {headers: new HttpHeaders({'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': 'ccfa90c16fe1486cb4a1a58ea7f49faf'})};
  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }


  startRecording() {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.stream = s;
      this.record();
    }).catch(error => {
      this._recordingFailed.next();
    });

  }

  abortRecording() {
    this.stopMedia();
  }

  private record() {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/wav',
      audioBitsPerSecond: 16000,
      desiredSampRate: 16000,
      bitrate: 16000,
      numberOfAudioChannels: 1
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
      },
      1000
    );
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {

    if (this.recorder) {
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this._recorded.next({ blob: blob, title: mp3Name });
        }
      }, () => {
        this.stopMedia();
        this._recordingFailed.next();
      });
    }
  }
  // sendAudio():Observable<any> {
  //   const formData: FormData = new FormData();
  //   const item= new Array();
  //   this.recorder.stop((blob) => {
  //   const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.wav');
  //   this.stopMedia();

  //   formData.append('file', blob, 'audio.wav');

  //   console.log(formData, blob);
  //   });
  //   return this.http.post<any>(this.apiUrl, formData, this.options);
  // }
  sendaudio(audio):Observable<any> {
    return this.http.post(this.apiUrl, audio, this.options);
  }
  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }

  getStatus():Observable<any>{
    return this.http.get(this.operationUrl,this.statusOptions);
  }
  getAudio():Observable<any>{
    return this.http.get(this.audioUrl,{responseType: 'blob'});
  }

}
