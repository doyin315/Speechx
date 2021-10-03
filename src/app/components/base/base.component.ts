import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FaceRecogntionService } from 'src/app/services/face-recogntion.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  options = [
    { name: 'Voice'},
    { name: 'Face'},
    { name: 'Emotion'}
  ]
  constructor(public router: Router,
              public faceService: FaceRecogntionService ) { }

  ngOnInit() {
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
