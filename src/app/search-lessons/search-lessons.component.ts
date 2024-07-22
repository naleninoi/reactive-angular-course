import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLessonsComponent implements OnInit {

  public searchResult$: Observable<Lesson[]>;

  public activeLesson: Lesson;

  constructor(
    private coursesService: CoursesService) {
  }

  ngOnInit() {


  }

  onSearch(search: string) {
    this.searchResult$ = this.coursesService.searchLessons(search);
  }

  openLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  onBackToSearch() {
    this.activeLesson = null;
  }
}











