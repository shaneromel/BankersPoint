import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { CategoryService } from '../../services/category.service';

import * as firebase from 'firebase';

import { Observable } from 'rxjs/Observable';

import { Student } from '../../models/student';
import { Category } from '../../models/category';

import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  uid:string;
  student_subscription:Subscription;
  categorySubscription:Subscription;
  sub:Subscription;

  students:Student[];
  categories:Category[];

  category:string;

  url:string;

  currentStudent:Student;

  email:string;
  phone:string;

  constructor(public afAuth:AngularFireAuth, private authService:AuthService, private studentService:StudentService, private categoryService:CategoryService, private router:Router) {
   }

  ngOnInit() {

    this.router.events.subscribe(event=>{
      this.url=this.router.url;
    })

    this.student_subscription=this.studentService.getStudent().subscribe(students=>{
      this.students=students;

      this.authService.afAuth.auth.onAuthStateChanged(user=>{
        if(user){
         this.uid=user.uid;
          for(var i=0;i<this.students.length;i++){
            if(this.uid===this.students[i].id){
              this.currentStudent=this.students[i];
            }
          }
          this.student_subscription.unsubscribe();
        }
      });
    });

    firebase.firestore().doc("settings/contact").onSnapshot(contact=>{
      this.email=contact.data().email;
      this.phone=contact.data().phone;
    });
     
  }

  logout(){
    this.authService.logout();
  }

  fetchUser(){
          
  }

}
