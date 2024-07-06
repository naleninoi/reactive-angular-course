import { Injectable } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {

  private subject = new BehaviorSubject<Course[]>([]);

  public courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  public filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category === category)
        .sort(sortCoursesBySeqNo))
    );
  }

  public saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    const index = courses.findIndex(c => c.id === courseId);

    const updatedCourse: Course = {
      ...courses[index],
      ...changes
    };

    const updatedCourses: Course[] = courses.slice(0);
    updatedCourses[index] = updatedCourse;

    this.subject.next(updatedCourses);

    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError(err => {
          const message = 'Could not save course';
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        shareReplay()
      );
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(response => response['payload']),
        catchError(err => {
          const message = 'Could not load courses';
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        tap(courses => this.subject.next(courses))
      );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }
}
