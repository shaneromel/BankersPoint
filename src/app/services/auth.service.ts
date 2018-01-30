import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

import { Student } from '../models/student';

declare var $:any;

@Injectable()
export class AuthService {

  constructor(public afAuth:AngularFireAuth, private router:Router) {
    
   }

  login(email,password):Observable<any>{
    return Observable.fromPromise(
      this.afAuth.auth.signInWithEmailAndPassword(email,password).then(()=>{
        this.router.navigate(['/course-listings']);
      }).catch(err=>{
        $("#signin-error-alert").text(err).show();
      })
    );
  }

  getUser(){
    return this.afAuth;
  }

  async register(student:Student,password:string){
    try{
      const result=await this.afAuth.auth.createUserWithEmailAndPassword(student.email,password);
      console.log(result);
      this.router.navigate(['/course-listings']);
    }
    catch(e){
      $("#signup-error-alert").text(e).show();
    }
  }

  isLoggedIn(){
    return this.afAuth.auth.currentUser;
  }

  changePassword(oldPass:string,newPass:string){
    var user=this.afAuth.auth.currentUser;
    var credential=firebase.auth.EmailAuthProvider.credential(user.email,oldPass);

    user.reauthenticateWithCredential(credential).then(()=>{
      this.afAuth.auth.currentUser.updatePassword(newPass).then(()=>{
        document.getElementById("edit-password").style.display="block";
      }).catch(err=>{
        alert(err);
      });
    }).catch(err=>{
      alert(err);
    });

  }

  editProfile(student:Student){
    var user=this.afAuth.auth.currentUser;
    user.updateProfile({
      displayName:student.name,
      photoURL:student.image
    }).then(()=>{
      console.log(user.displayName);

    }).catch(err=>{
      console.log(err);
    })
  }

  logout(){
    this.afAuth.auth.signOut().then(()=>{
      this.router.navigate(['/signin']);
    });
  }

}
