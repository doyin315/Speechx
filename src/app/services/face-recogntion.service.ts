import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceRecogntionService {

  
  constructor(public http: HttpClient) { }

  private faceData$ = new BehaviorSubject(null);
  faceState = this.faceData$.asObservable();


  setfaceState(data) {
    this.faceData$ .next(data);
  }


  public validFaceIds = [];
  private isemotion$ = new BehaviorSubject(false);

  emotionState = this.isemotion$.asObservable();

  setEmotion(data) {
  this.isemotion$.next(data);
}

detectionEnd= `https://facetracker.cognitiveservices.azure.com/face/v1.0/detect?detectionModel=detection_01&returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,smile`


options = {headers: new HttpHeaders({'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': 'cf973bb003454ceca722e9afff9f952c'})};
data={
  url:'https://doyinstore.blob.core.windows.net/image/pic3.jpg'
}

test={
  url:"https://doyinstore.blob.core.windows.net/image/pic4.jpg"
}
testId="b48e6385-187f-4fee-b4c6-6fc1a99a9973"



// faceIds=["a6a75687-07e2-4347-90ca-3465e6155cf2","3c9107cf-e8c2-4c20-9fd7-e7bbe3415ed7","c3d7878a-964b-4553-9f09-94026f67826a"]
// test ="https://speechxstore.blob.core.windows.net/test/test.jpg"

faceIds=["fce943f3-b1d9-4128-9955-f1828ab7e0b1","ebfdbe1f-f10f-4d3d-a97c-cc6ad3abc1b5"]

testEnd= `https://facetracker.cognitiveservices.azure.com/face/v1.0/findsimilars`
testData={
  faceId: this.testId,
  faceIds: [...this.faceIds],
  maxNumOfCandidatesReturned: 10,
  mode: "matchPerson"
}

  getBlob(url): Observable<any> {
    let data={  
      url:  url
    }
    return this.http.post(this.detectionEnd, data, this.options)
  }

  sendFace(data){
    return this.http.post(this.detectionEnd, this.data, this.options)
  }


  verifyFace(id, faceIds= ['']){

    const testData={
      faceId: id,
      faceIds: [...faceIds],
      maxNumOfCandidatesReturned: 10,
      mode: "matchPerson"
    }

    return this.http.post(this.testEnd,testData, this.options)
  }


  start(){
    // return this.http.get(`http://192.168.8.102:5000/start`)
    return this.http.get(`http://192.168.43.101:5000/start`)
  }

  stop(){
    return this.http.get(`http://192.168.43.101:5000/stop`)
  }

}

// faceId: "358f7c71-e864-4a34-8996-8a98d7799595"
// 'https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg'


// pic1url="https://doyinstore.blob.core.windows.net/image/pic1.jpg"
// pic2Url="https://doyinstore.blob.core.windows.net/image/pic2.jpg"
//pic3Url="https://doyinstore.blob.core.windows.net/image/pic3.jpg"

// faceidSis="8a77f142-7a34-4a2c-9c9f-7dd4c0f95284"