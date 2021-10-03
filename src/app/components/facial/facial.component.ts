import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { stat } from 'fs';
import { ToastrService } from 'ngx-toastr';
import { FaceRecogntionService } from 'src/app/services/face-recogntion.service';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-facial-recog',
  templateUrl: './facial.component.html',
  styleUrls: ['./facial.component.scss']
})
export class FacialComponent implements OnInit {

  imgSrc;
  form: FormGroup;
  store={}
  emotion = false;

  constructor(
    public fb: FormBuilder,
    private faceService: FaceRecogntionService,
    private toastr: ToastrService,
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initImg();
    this.faceService.emotionState.subscribe(
      (state) =>{
        this.emotion = state;
      })
    
  }

  initImg(){
    this.url.valueChanges.subscribe(
      data =>this.setImg(data)
    )
  }

  setImg(link){
    if(link){
      this.imgSrc=link
    }
  }

  initForm(){
    this.form = this.fb.group({
      url: ['', Validators.required]
    })
  }

faceVerify(value){
  const {url} = value;

  if (this.store[url]){
    this.verify(this.store[url].id, url)
    return
  }

  this.faceService.getBlob(url).subscribe(
    res=>{
      this.store[url] = {id: res[0].faceId,
                        smile: res[0].faceAttributes.smile }

      this.verify(this.store[url].id, url)
    },
    err=>{
      this.toastr.error("Error Generating Id");
    },
    ()=>{

    })
  }

  verify(id, url){
        this.faceService.verifyFace(id).subscribe(
          (res: any)=>{
            console.log('ress',res)

            let total=0

            for (let i=0; i<res.length; i++){
              total= total + res[i].confidence
            }

            console.log('total',total)

            let ave = total/res.length
            console.log('ave',ave)
            if(total>=0.5){
              if(!this.emotion){
                this.toastr.success("Valid Face");
                this.authService.setAuth(true);
                this.router.navigate(['/main'])
              }
              else{
                console.log("smile status",this.store[url].smile )
                if(this.store[url].smile == 1){
                  this.toastr.success("Valid Face and Emotional state");
                  this.authService.setAuth(true);
                  this.router.navigate(['/main'])
                }
                else{
                  this.toastr.error('User is not in right emotional state');
                }
                
              }
             
            }
            else{
              this.toastr.error('Invalid face');
            }
          },
          err=>{
            console.log(err)
          }
        )
  }

  testVerify(){
    this.faceService.verifyFace('').subscribe(
      (res: any)=>{
        console.log('ress',res)

        let total=0

        for (let i=0; i<res.length; i++){
          total= total + res[i].confidence
        }

        console.log('total',total)

        let ave = total/res.length
        console.log('ave',ave)
        if(total>=0.5){
          this.toastr.success("Valid Face")
        }
        else{
          this.toastr.error('Invalid face');
        }
      },
      err=>{
        console.log(err)
      }
    )
  }


  get url(): FormControl{
    return this.form.get('url') as FormControl;
  }

  startPi(){
    this.faceService.start().subscribe(
      res=>{
        console.log(res)
      },
      err=>{

      },
      ()=>{

      }
    )
  }

  stopPi(){
    this.faceService.stop().subscribe(
      res=>{
        console.log(res)
      },
      err=>{

      },
      ()=>{

      }
    )
  }
}
