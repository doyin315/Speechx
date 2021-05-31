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



faceIds=["3497d496-eca8-4272-868f-bf4417af7f51","8bcc3b0b-8871-4ac7-971f-adfa4c490d47","a48d79ce-b312-450d-819b-a0c6a3c63104"]


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
    return this.http.post(this.detectionEnd, this.test, this.options)
  }

  sendFace(data){
    return this.http.post(this.detectionEnd, this.data, this.options)
  }


  verifyFace(id){

    const testData={
      faceId: id,
      faceIds: [...this.faceIds],
      maxNumOfCandidatesReturned: 10,
      mode: "matchPerson"
    }

    return this.http.post(this.testEnd,testData, this.options)
  }


}

// faceId: "358f7c71-e864-4a34-8996-8a98d7799595"
// 'https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg'


// pic1url="https://doyinstore.blob.core.windows.net/image/pic1.jpg"
// pic2Url="https://doyinstore.blob.core.windows.net/image/pic2.jpg"
//pic3Url="https://doyinstore.blob.core.windows.net/image/pic3.jpg"

// faceidSis="8a77f142-7a34-4a2c-9c9f-7dd4c0f95284"