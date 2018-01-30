import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Category } from '../models/category';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class CategoryService {
  categoryCollection:AngularFirestoreCollection<Category[]>;

  categories:Observable<Category[]>

  constructor(public af:AngularFirestore) {
    this.categoryCollection=this.af.collection('categories');

    this.categories=this.categoryCollection.snapshotChanges().map(changes=>{
      return changes.map(a=>{
        const data=a.payload.doc.data() as Category;
        data.id=a.payload.doc.id;
        return data;
      })
    });
   }

   getCategories(){
     return this.categories;
   }

}
