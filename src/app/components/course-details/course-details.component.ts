import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe, NgStyle } from '@angular/common';

import { Course } from '../../models/course';
import { Section } from '../../models/section';
import { Instructor } from '../../models/instructor';
import { Rating } from '../../models/rating';

import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { InstructorService } from '../../services/instructor.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as firebase from 'firebase';

import { MatTabsModule } from '@angular/material/tabs';

import { NgModule } from '@angular/core';

declare var $,Instamojo:any;

@NgModule({
  imports: [
    MatTabsModule
  ]
})

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  id:string;
  private sub:Subscription;
  private courses:Course[];
  course:Course;
  subscription_course:Subscription;
  data_keys:any[][];
  public sections:Section[];
  subscription_section:Subscription;
  courseInstructor:Instructor;
  subscription_intructor:Subscription;
  instructors:Instructor[];
  subscription_rating:Subscription;
  ratings:Rating[];

  ratingExact:number;
  videos:number;

  rating:number[];
  rating_void:number[];
  looper:number[];
  avgRatings:Style[];

  isSubscribed:boolean;
  isFree:boolean;

  couponCode:string;
  couponApplied:boolean;
  originalPrice:number;
  progressWidth:string;
  days:number;


  constructor(private route:ActivatedRoute, private courseService:CourseService, private authService:AuthService, private instructorService:InstructorService, private router:Router) {
    this.couponApplied=false;
    this.avgRatings=new Array();
    this.videos=0;
    this.isSubscribed=false;
    this.ratingExact=0;
  }

  ngOnInit() {
    this.sub=this.route.params.subscribe(params=>{
      this.id=params['id'];
    });

    this.subscription_course=this.courseService.getCourse().subscribe(courses=>{
      courses.forEach(course=>{
        if(course.id===this.id){
          this.course=course;
          this.isFree=course.is_free;
        }
      });
    });

    firebase.firestore().doc("courses/"+this.id).collection("rating").get().then(querySnapshot=>{
      var s=0;
      querySnapshot.forEach(doc=>{
        s=s+doc.data().rating;
      });
      if(s>0){
        this.ratingExact=s/querySnapshot.size;
      }
      this.rating=Array(Math.floor(this.ratingExact)).fill(1);
      this.rating_void=Array(5-Math.floor(this.ratingExact)).fill(1);
    });

    this.authService.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        firebase.firestore().doc("students/"+user.uid+"/my_courses/"+this.id).get().then(doc=>{
          if(doc.exists){
            this.isSubscribed=true;
            var dateDiff=Date.now()-doc.data().date;
            this.days=(((dateDiff/60000))/60)/24;
            this.progressWidth=Math.floor((this.days/this.course.validity*100)).toString()+"%";
          }
        });
      }
    });

    this.loop();

  }

  loop(){
    this.looper=new Array();
    for(var i=0;i<5;i++){
      this.looper.push(i+1);
    }
  }

  display(){
    console.log(this.authService.isLoggedIn());
  }

  ngOnDestroy(){
    if(this.subscription_course){
      this.subscription_course.unsubscribe();
    }
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  applyCode(){
    var c=0;
    if(!this.couponApplied){
      this.originalPrice=this.course.price_offer;
      firebase.firestore().collection("coupon-codes").get().then(querySnapshot=>{
        querySnapshot.forEach(doc=>{
          if(doc.data().code===this.couponCode){
            this.course.price_offer=Math.floor(this.course.price_offer-this.course.price_offer*doc.data().discount/100);
            this.couponApplied=true;
            $("#coupon-invalid").hide();
            c++;
          }
        });
        if(c==0){
          $("#coupon-invalid").show();
        }
      });
    }
  }

  pay(){
    this.authService.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        var purpose=this.course.name;
        if(purpose.length>29){
          purpose=purpose.substring(0,29);
        }
        window.location.replace("https://bankerspoint.org/payment.php?purpose="+purpose+"&amount="+this.course.price_offer+"&email="+user.email+"&course_id="+this.course.id+"&type=course");
      }else{
        this.router.navigate(['/signin']);
      }
    })
  }

  cancelCoupon(){
    this.course.price_offer=this.originalPrice;
    this.couponApplied=false;
  }

}

interface Style{
  width ? :string
}