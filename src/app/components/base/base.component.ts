import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

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
  constructor(public router: Router) { }

  ngOnInit() {
  }

  navigation(key){
    console.log(key)
    if (key == 'voice'){
      this.router.navigate(['/voice'])
    }

    else if(key == 'face'){
      this.router.navigate(['/face'])

    }
    else{
      this.router.navigate(['/face'])

    }
  }
}
