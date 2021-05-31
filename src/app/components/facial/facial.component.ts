import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FaceRecogntionService } from 'src/app/services/face-recogntion.service';

@Component({
  selector: 'app-facial-recog',
  templateUrl: './facial.component.html',
  styleUrls: ['./facial.component.scss']
})
export class FacialComponent implements OnInit {

  imgSrc;
  form: FormGroup;
  store={}

  constructor(
    public fb: FormBuilder,
    private faceService: FaceRecogntionService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initImg();
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
    this.verify(this.store[url])
    return
  }

  this.faceService.getBlob(url).subscribe(
    res=>{
      this.store[url] =res[0].faceId
      this.verify(this.store[url])
    },
    err=>{
      this.toastr.error("Error Generating Id");
    },
    ()=>{

    })
  }

  verify(id){
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
}
