import { Injectable } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {

  public courses$: Observable<Course[]>;

  public filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category === category)
        .sort(sortCoursesBySeqNo))
    );
  }

}
