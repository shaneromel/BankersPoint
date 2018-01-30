import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as firebase from 'firebase';

import { CourseBundleService } from '../../services/course-bundle.service';
import { AuthService } from '../../services/auth.service';

import { CourseBundle } from '../../models/coursebundle';

import { Subscription } from 'rxjs/Subscription';

declare var $:any;

@Component({
  selector: 'app-course-bundle-details',
  templateUrl: './course-bundle-details.component.html',
  styleUrls: ['./course-bundle-details.component.css']
})
export class CourseBundleDetailsComponent implements OnInit {
  sub:Subscription;
  courseBundleSubscription:Subscription;

  courseBundleId:string;

  courseBundle:CourseBundle;
  myCourseBundles:string[];

  isSubscribed:boolean;

  couponCode:string;
  couponApplied:boolean;
  origPrice:number;

  constructor(private courseBundleService:CourseBundleService, private route:ActivatedRoute, private authService:AuthService) {
    this.couponApplied=false;
    this.myCourseBundles=new Array();
   }

  ngOnInit() {
    this.sub=this.route.params.subscribe(params=>{
      this.courseBundleId=params['id'];
    });

    this.courseBundleSubscription=this.courseBundleService.getCourseBundle().subscribe(courseBundles=>{
      courseBundles.forEach(courseBundle=>{
        if(courseBundle.id===this.courseBundleId){
          this.courseBundle=courseBundle;
        }
      });
      
      this.authService.afAuth.auth.onAuthStateChanged(user=>{
        if(user){
          firebase.firestore().doc("students/"+user.uid+"/my_course_bundles/"+this.courseBundleId).get().then(doc=>{
            if(doc.exists){
              this.isSubscribed=true;
            }else{
              this.isSubscribed=false;
            }
          });
        }
      });
    });

  }

  applyCode(){
    if(!this.couponApplied){
      firebase.firestore().collection("coupon-codes").where("code","==",this.couponCode).get().then(querySnapshot=>{
        var coupon;
        querySnapshot.forEach(doc=>{
          coupon=doc.data();
        });
        this.origPrice=this.courseBundle.price_offer;
        this.courseBundle.price_offer=Math.floor(this.courseBundle.price_offer-this.courseBundle.price_offer*coupon.discount/100);
        $("#coupon-error").hide();
        this.couponApplied=true;
      }).catch(()=>{
        $("#coupon-error").show();
      })
    }
  }

  pay(){
    this.authService.afAuth.auth.onAuthStateChanged(user=>{
      if(user){
        window.location.replace("http://syndicatesera.com/payment.php?purpose="+this.courseBundle.name+"&amount="+this.courseBundle.price_offer+"&email="+user.email+"&course_id="+this.courseBundle.id+"&type=bundle");
      }
    })
  }

  cancelCoupon(){
    this.courseBundle.price_offer=this.origPrice;
    this.couponApplied=false;
  }

  ngOnDestroy(){
    if(this.courseBundleSubscription){
      this.courseBundleSubscription.unsubscribe();
    }
  }

}
