import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CourseService } from '../../services/course.service';

import { Subscription } from 'rxjs/Subscription';

import { Lecture } from '../../models/lecture';

// import { VgMedia, VgAPI } from 'videogular2/core';
 
import * as firebase from 'firebase';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

declare var $,VdoPlayer,onVdoCipherAPIReady,vdo:any;

@Component({
  selector: 'app-lecture-video',
  templateUrl: './lecture-video.component.html',
  styleUrls: ['./lecture-video.component.css']
})
export class LectureVideoComponent implements OnInit {
  sub:Subscription;
  subCourse:Subscription;
  lectureSubscription:Subscription;
  requestSubscription:Subscription;

  lecture:Lecture;
  lectures:Lecture[];

  sectionId:string;
  lectureId:string;
  courseId:string;

  videoList:string[];
  video:string;

  videoIndex:number;

  // api:VgAPI

  videoQuality:string[];
  selectedVideoQuality:string;
  index:number;

  loading:boolean;

  constructor(private route:ActivatedRoute, private courseService:CourseService, private router:Router, private http:HttpClient) {
    
    this.videoQuality=["1080p","720p","360p"];
    this.selectedVideoQuality="1080p";
    this.index=0;
    this.videoList=new Array();
    this.videoIndex=0;
   }

  ngOnInit() {

    this.subCourse=this.route.parent.params.subscribe(params=>{
      this.courseId=params['course-id'];

      firebase.firestore().doc('courses/'+this.courseId).collection("section").get().then(querySnapshot=>{
        querySnapshot.forEach(doc=>{
          firebase.firestore().doc('courses/'+this.courseId+"/section/"+doc.id).collection("lecture").get().then(querySnapshot1=>{
            querySnapshot1.forEach(doc1=>{
              this.videoList.push(doc.id+"/"+doc1.id);
            })
            
          })
        })
        console.log(this.videoList);
      })

    });

    this.sub=this.route.params.subscribe(params=>{
      this.sectionId=params['section-id'];
      this.lectureId=params['lecture-id'];
      this.loading=true;
      this.lectureSubscription=this.courseService.getLecture(this.courseId,this.sectionId).subscribe(lectures=>{
        this.lectures=lectures;
        this.lectures.forEach(lect=>{
          if(lect.id===this.lectureId){
            this.lecture=lect;
            this.video=this.lecture.video;

            this.loadVideo(this.video);
          }
        })
        //this.loadVideo(this.video);
      });
      

    });

    var sectionRef=firebase.firestore().doc('courses/'+this.courseId).collection("section").get().then(querySnapshot=>{
      querySnapshot.forEach(doc=>{
        firebase.firestore().doc('courses/'+this.courseId+'/section/'+doc.id).collection('lecture').get().then(lectures=>{
          lectures.forEach(doc1=>{
            
          });
        });
      });
    });

    
// install flowplayer into selected container


  }

  ngAfterViewInit(){
    
  }

  // onPlayerReady(api:VgAPI){
  //   this.api=api;

  //   this.api.getDefaultMedia().subscriptions.loadedData.subscribe(()=>{
  //     this.api.getDefaultMedia().play();
  //   });

  //   var x=1;

  //   this.api.getDefaultMedia().subscriptions.ended.subscribe(()=>{
  //     this.api.getDefaultMedia().currentTime=0;
  //     x=x+1;
  //   });
  // }

  changeSource(){
    // if(this.index<3){
    //   this.selectedVideoQuality=this.videoQuality[this.index];
    //   this.video=this.videoList[this.index];
    //   this.loadVideo(this.video);
    //   this.index++;
    // }else{
    //   this.index=0;
    //   this.selectedVideoQuality=this.videoQuality[this.index];
    //   this.video=this.videoList[this.index];
    //   this.loadVideo(this.video);
    //   this.index++;
    // }
    this.loadVideo(this.video);
  }

  loadVideo(video_id:string){
    if(this.requestSubscription){
      this.requestSubscription.unsubscribe();
    }
    var video;
    // var xmlHttp = new XMLHttpRequest();
    //     xmlHttp.onreadystatechange = ()=> { 
    //         if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

    //             var response = JSON.parse(xmlHttp.responseText);
    //             console.log(response.otp);

    //             if(response.otp) {
    //                video = new VdoPlayer({
    //                 otp: response.otp,
    //                 playbackInfo: btoa(JSON.stringify({
    //                   videoId: video_id
    //                 })),
    //                 autoplay:true,
    //                 theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
                  
    //                 container: document.querySelector( "#embedBox" ),
    //               });
                  
    //               this.videoIndex=this.videoList.indexOf(this.sectionId+"/"+this.lectureId);

    //               video.addEventListener("ended",()=>{
    //                 if(this.videoIndex<this.videoList.length-1){
    //                   this.videoIndex++;
                    
    //                   var section=this.videoList[this.videoIndex].substring(0,this.videoList[this.videoIndex].indexOf('/'));
    //                   var lecture=this.videoList[this.videoIndex].substring(this.videoList[this.videoIndex].indexOf('/')+1);
    //                   console.log(this.videoIndex+"=>"+section+"=>"+lecture);
    //                   this.router.navigate(['../../',section,lecture],{relativeTo:this.route});
    //                 }
    //               });

    //               video.addEventListener("load",()=>{
    //                 this.loading=false;
    //               })

    //             }

    //         }
    //     }
        //xmlHttp.open("POST", "https://api.vdocipher.com/v2/otp?video="+video_id, true);
        // xmlHttp.open("GET", "http://bankersway.com/gaurav/api/video/"+video_id, true);
        // //xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        // xmlHttp.send(null);


        // this.http.post("https://api.vdocipher.com/v2/otp","clientSecretKey=8cea818a78294c1ea5b1dfddc70c6c12281166b5003f40fbb7874764a69897ff",{
        //   params:new HttpParams().set('video',video_id),
        //   headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
        // }).subscribe(data=>{
        //   console.log(data);
        // })

    this.requestSubscription=this.http.get<Otp>("http://bankersway.com/gaurav/api/video/"+video_id).subscribe(response=>{
      video = new VdoPlayer({
        otp: response.otp,
        playbackInfo: btoa(JSON.stringify({
          videoId: video_id
        })),
        autoplay:true,
        theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
      
        container: document.querySelector( "#embedBox" ),
      });
      
      this.videoIndex=this.videoList.indexOf(this.sectionId+"/"+this.lectureId);

      video.addEventListener("ended",()=>{
        if(this.videoIndex<this.videoList.length-1){
          this.videoIndex++;
        
          var section=this.videoList[this.videoIndex].substring(0,this.videoList[this.videoIndex].indexOf('/'));
          var lecture=this.videoList[this.videoIndex].substring(this.videoList[this.videoIndex].indexOf('/')+1);
          console.log(this.videoIndex+"=>"+section+"=>"+lecture);
          this.router.navigate(['../../',section,lecture],{relativeTo:this.route});
        }
      });

      video.addEventListener("load",()=>{
        this.loading=false;
      })
    })

  }

  ngOnDestroy(){
    if(this.lectureSubscription){
      this.lectureSubscription.unsubscribe();
    }
  }

}
interface Otp{
  otp:string
}