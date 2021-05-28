import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FaceRecogntionService {

  
  constructor(public http: HttpClient) { }

detectionEnd= `https://facetracker.cognitiveservices.azure.com/face/v1.0/detect?detectionModel=detection_03&returnFaceId=true&returnFaceLandmarks=false`


options = {headers: new HttpHeaders({'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': 'cf973bb003454ceca722e9afff9f952c'})};
data={
  url:'https://doyinstore.blob.core.windows.net/image/pic3.jpg'
}

test={
  url:"https://doyinstore.blob.core.windows.net/image/pic4.jpg"
}
testId="b48e6385-187f-4fee-b4c6-6fc1a99a9973"


faceIds=["18438b2c-b229-4f84-8a1e-2d0304571755","9da5b5e3-c748-4fe2-b6b4-4165e9a1f6be","7e0016f9-9c58-446d-94de-b3b60c9e11e0","a91bb69e-45ff-4800-ae33-14900632c212"]


testEnd= `https://facetracker.cognitiveservices.azure.com/face/v1.0/findsimilars`
testData={
  faceId: this.testId,
  faceIds: [...this.faceIds],
  maxNumOfCandidatesReturned: 10,
  mode: "matchPerson"
}

  getBlob(url): Observable<any> {
    console.log(url)
    const blob = url.changingThisBreaksApplicationSecurity;

    let data={  
      url:  url
    }
    return this.http.post(this.detectionEnd, this.test, this.options)
  }

  sendFace(data){
    return this.http.post(this.detectionEnd, this.data, this.options)
  }


  verifyFace(){
    return this.http.post(this.testEnd, this.testData, this.options)
  }


}

// faceId: "358f7c71-e864-4a34-8996-8a98d7799595"
// 'https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg'


// pic1url="https://doyinstore.blob.core.windows.net/image/pic1.jpg"
// pic2Url="https://doyinstore.blob.core.windows.net/image/pic2.jpg"
//pic3Url="https://doyinstore.blob.core.windows.net/image/pic3.jpg"

// faceidSis="8a77f142-7a34-4a2c-9c9f-7dd4c0f95284"