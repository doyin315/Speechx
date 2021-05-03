import { Injectable,NgZone } from '@angular/core';
import { Observable} from 'rxjs';
import * as _ from 'lodash';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Iwindow } from '../models/window';
import { BehaviorSubject } from 'rxjs';

export interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition:any
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecogService  {
  speechRecognition: any;

 constructor(private zone: NgZone) {
  }
  private source$ = new BehaviorSubject('');

  source = this.source$.asObservable();
  record(): Observable<string> {

    return Observable.create(observer => {
      const {webkitSpeechRecognition}: Iwindow = <any>window
      // const {SpeechRecognition}: IWindow = <IWindow>window;

      // this.speechRecognition = new SpeechRecognition();
      this.speechRecognition = new webkitSpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-us';
      this.speechRecognition.maxAlternatives = 10;

      this.speechRecognition.onresult = speech => {
          let term: string = "";
          if (speech.results) {
              var result = speech.results[speech.resultIndex];
              var transcript = result[0].transcript;
              if (result.isFinal) {
                  if (result[0].confidence < 0.3) {
                      console.log("Unrecognized result - Please try again");
                  }
                  else {
                      term = _.trim(transcript);
                     
                  }
              }
          }
          this.zone.run(() => {
              observer.next(term);
              this.source$.next(term);
          });
      };

      this.speechRecognition.onerror = error => {
          observer.error(error);
      };
      this.speechRecognition.onend = () => {
        observer.complete();
    };

      this.speechRecognition.start();
      console.log("Say something - We are listening !!!");
  });
}
  DestroySpeechObject() {
    if(this.speechRecognition) {
        this.speechRecognition.stop();
    }
  }

}
