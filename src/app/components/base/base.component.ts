import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FaceRecogntionService } from 'src/app/services/face-recogntion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  faceSet = false;
  urls = ["https://doyinstore.blob.core.windows.net/image/pic4.jpg", "https://doyinstore.blob.core.windows.net/image/pic5.jpg"];
  faceData= []
  options = [
    { name: 'Voice'},
    { name: 'Face'},
    { name: 'Emotion'}
  ]
  constructor(public router: Router,
              private toastr: ToastrService,
              public faceService: FaceRecogntionService ) { }

  ngOnInit() {
    this.faceService.faceState.subscribe(
      (state) =>{
        this.faceSet = state? state.faceSet : false;
        this.faceData = state? [...state.faceData] : [];
      })
    
    this.configImages();
  }

  configImages(){
    if(!this.faceSet){
      for(let url of this.urls){
        this.faceService.getBlob(url).subscribe(
          res=>{
            console.log('res', res);
            console.log("faceId", res[0].faceId)
            this.faceData.push(res[0].faceId)
            console.log("facedata", this.faceData)
          },
          err=>{
            this.toastr.error("Error Generating Id");
          },
          ()=>{
            this.faceService.setfaceState(
              {
                faceSet : true,
                faceData : [...this.faceData]
              }
            )
            console.log("sentttttt");
            this.faceSet = true
          })
      }


    }
  }

  navigation(key){
    console.log(key)
    if (key == 'voice'){
      this.router.navigate(['/voice'])
    }

    else if(key == 'face'){
      this.faceService.setEmotion(false);
      this.router.navigate(['/face'])

    }
    else{
      this.faceService.setEmotion(true);
      this.router.navigate(['/face'])

    }
  }
}
