import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { CategoryService } from '../../services/category.service';
import { CourseService } from '../../services/course.service';
import { InstructorService } from '../../services/instructor.service';

import { Subscription } from 'rxjs/Subscription';

import { Category } from '../../models/category';
import { Course } from '../../models/course';
import { Instructor } from '../../models/instructor';
import { Rating } from '../../models/rating';

declare var $:any;
declare var jquery:any;

@Component({
  selector: 'app-explore-courses',
  templateUrl: './explore-courses.component.html',
  styleUrls: ['./explore-courses.component.css']
})
export class ExploreCoursesComponent implements OnInit {
  category:string;
  selectedCategory:string;
  course:Course;

  categories:Category[];
  courses:Course[]
  instructors:Instructor[];
  ratings:Rating[];

  sub:Subscription;
  categorySubscription:Subscription;
  courseSubscription:Subscription;
  instructorSubscription:Subscription;
  ratingSubscription:Subscription;

  public loading:boolean;

  constructor(private route:ActivatedRoute, private categoryService:CategoryService, private courseService:CourseService, private instructorService:InstructorService) {
    this.loading=true;
  }

  ngOnInit() {

    this.instructorSubscription=this.instructorService.getInstructor().subscribe(instructors=>{
      this.instructors=instructors;
    });

    // this.categorySubscription=this.categoryService.getCategories().subscribe(categories=>{
    //   this.categories=categories;
    // });
      
    this.courseSubscription=this.courseService.getCourse().subscribe(courses=>{
  
      this.sub=this.route.params.subscribe(params=>{
        this.courses=new Array();
        this.category=params['category'];

        this.selectedCategory=this.category;

        for(var i=0;i<courses.length;i++){
          if(courses[i].category===this.selectedCategory){
            this.courses.push(courses[i]);
          }
        }

        var n=this.courses.length;
        var rows,col,c=0;
        $(".content").remove();
  
        if(n%3==0){
          rows=n/3;
        }else{
          rows=Math.floor(n/3+1);
        }
  
        for(var i=0;i<rows;i++){
          $("#grids").append("<div id='row"+i+"' class='row content'></div>");
          if(n-c>=3){
            col=3;
          }else{
            col=n-c;
          }
  
          for(var j=0;j<col;j++){

            for(var l=0;l<this.instructors.length;l++){
              if(this.instructors[l].id===this.courses[c].instructor_id){
                var courseInstructor=this.instructors[l];
              }
            }

            //$("#row"+i).append("<div id='"+this.courses[c].id+"' class='col-md-4 courses' ><a href='course-details/"+this.courses[c].id+"' >              <div class='card course-card'>                <img class='card-img-top' src="+this.courses[c].image+" width='100%' height='150px' alt='Card image cap'>                <div class='card-block'>                  <h4 class='card-title'>"+this.courses[c].name+"</h4>                  <span class='card-text item'>"+courseInstructor.name+"</span>                  <span class='item' id='rating"+c+"' >                                        </span>                  <span class='text-success item'>₹"+this.courses[c].price_offer+" <span class='text-success' style='text-decoration:line-through;float:right' >₹"+this.courses[c].price_actual+"</span></span>                </div>              </div>            </a></div>");
            $("#row"+i).append("<div id='"+this.courses[c].id+"' class='col-md-4 courses' ><a href='course-details/"+this.courses[c].id+"' >              <div class='card course-card'>                <img class='card-img-top' src="+this.courses[c].image+" width='100%' height='150px' alt='Card image cap'>                <div class='card-block'>                  <h4 class='card-title'>"+this.courses[c].name+"</h4>                                   <span class='item' id='rating"+c+"' >                                        </span>                                  </div> <div class='card-footer' style='padding-right:0;' > <span style=' float:right; background-color:#11a15d; color:white; padding-left:15px;padding-right:10px; ' class=' item'><span style='font-size:20px;' >₹</span><strong style='font-size:18px;' >"+this.courses[c].price_offer+"</strong> </span> <span class='text-success' style='text-decoration:line-through; padding-right:10px; float:right;' ><span style='font-size:20px;' >₹</span><span style='font-size:18px;' >"+this.courses[c].price_actual+"</span></span> </div>            </div>            </a></div>");
            //this.rateCourse(c);
            
            c++;
            courseInstructor=null;
          }
  
        }

      });
      this.loading=false;
    });

  }

  rateCourse(c:number){

    this.ratingSubscription=this.courseService.getRating(this.courses[c].id).subscribe(ratings=>{
      console.log(this.courses[c].id);
      this.ratings=ratings;
      var avg,s=0;
      console.log(ratings);

      for(var p=0;p<ratings.length;p++){
        s=s+ratings[p].rating;
      }
      avg=Math.floor(s/ratings.length);
      var rate_void=5-avg;
      console.log(ratings.length);
      $(".stars"+c).remove();
      for(var f=0;f<avg;f++){
        $("#rating"+c).append("<span class='fa fa-star checked stars"+c+"'></span>");
        console.log(c);
      }
      for(var f=0;f<rate_void;f++){
        $("#rating"+c).append("<span class='fa fa-star stars"+c+"'></span>");
      }

    });

  }

  ngOnDestroy(){
    if(this.instructorSubscription){
      this.instructorSubscription.unsubscribe();
    }
    if(this.courseSubscription){
      this.courseSubscription.unsubscribe();
    }
    if(this.categorySubscription){
      this.categorySubscription.unsubscribe();
    }
  }

}
