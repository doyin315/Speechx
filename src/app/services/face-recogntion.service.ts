import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FaceRecogntionService {

  
  constructor(public http: HttpClient) { }

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

faceIds=["903f62d8-13ea-48a1-b974-8efbb5401f69", "7060b5b7-32dd-4ed0-88ad-1f7bbd5b174e"]

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


  verifyFace(id){

    const testData={
      faceId: id,
      faceIds: [...this.faceIds],
      maxNumOfCandidatesReturned: 10,
      mode: "matchPerson"
    }

    return this.http.post(this.testEnd,testData, this.options)
  }


  start(){
    return this.http.get(`http://192.168.8.102:5000/start`)
  }

  stop(){
    return this.http.get(`http://192.168.8.102:5000/stop`)
  }

}

// faceId: "358f7c71-e864-4a34-8996-8a98d7799595"
// 'https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg'


// pic1url="https://doyinstore.blob.core.windows.net/image/pic1.jpg"
// pic2Url="https://doyinstore.blob.core.windows.net/image/pic2.jpg"
//pic3Url="https://doyinstore.blob.core.windows.net/image/pic3.jpg"

// faceidSis="8a77f142-7a34-4a2c-9c9f-7dd4c0f95284"