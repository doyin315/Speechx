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

  verificationProfileId = "ee51a4c8-0042-4b93-af1a-4ac139a6ed85";
  // tslint:disable-next-line: max-line-length
  verificationEnrollEndpoint = `https://speechx.cognitiveservices.azure.com/spid/v1.0/verificationProfiles/${this.verificationProfileId}/enroll`
  jsonContent = 'application/json';
  formContent = 'multipart/form-data';
  testIdentificationProfileId = 'b488606b-022d-4c6d-9a26-e650e4dc404f';
  operationid = 'b26c1ad8-5b38-449b-b07c-8a9d57669fb9';
  operationUrl = `https://speechx.cognitiveservices.azure.com/spid/v1.0/operations/${this.operationid}`;
  identificationProfileId = '195cc4ca-20bc-4b7c-bf0e-562855a2e159';
  params = {shortAudio: true};
  apiUrl = `https://speechx.cognitiveservices.azure.com/spid/v1.0/identificationProfiles/${this.testIdentificationProfileId}/enroll`;
  audioUrl = 'assets/audio.wav';
  options = {headers: new HttpHeaders({'Content-Type': 'multipart/form-data',
                                      'Ocp-Apim-Subscription-Key': 'ccfa90c16fe1486cb4a1a58ea7f49faf'})};

  verificationUrl = `https://speechx.cognitiveservices.azure.com/spid/v1.0/verify?verificationProfileId=${this.verificationProfileId}`;
  verificationIdEndpoint = `https://speechx.cognitiveservices.azure.com/spid/v1.0/verificationProfiles`;
  statusOptions = {headers: new HttpHeaders({'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': 'ccfa90c16fe1486cb4a1a58ea7f49faf'})};
  lang = { "locale":"en-us",}
  phraseUrl = `https://speechx.cognitiveservices.azure.com/spid/v1.0/verificationPhrases?locale=en-US`;

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
  sendAudio(audio): Observable<any> {
    return this.http.post<any>(this.apiUrl, audio, this.options);
  }

  verifyAudio(audio): Observable<any>  {

    return this.http.post<any>(this.verificationUrl, audio, this.options);
  }
  // sendaudio(audio):Observable<any> {
  //   return this.http.post(this.apiUrl, audio, this.options);
  // }
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

  getPhraseList() {
    return this.http.get<any>(this.phraseUrl, this.options);
  }
  getVerificationProfile() {
    return this.http.post<any>(this.verificationIdEndpoint, this.lang, this.options);
  }
  VerificationEnrollment(audio) {
    return this.http.post<any>(this.verificationEnrollEndpoint, audio, this.options);
  }
  getBlob(url): Observable<any> {
    const blob = url.changingThisBreaksApplicationSecurity;
    console.log(blob.slice(5));
    return this.http.get(blob , {responseType: 'blob'});
  }

  getStatus(): Observable<any> {
    return this.http.get(this.operationUrl, this.statusOptions);
  }
  getAudio(): Observable<any> {
    return this.http.get(this.audioUrl, {responseType: 'blob'});
  }

}
