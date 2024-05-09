import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, Observable, of } from 'rxjs';
import { concatMap, finalize, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class LoadingService {

  public loading$: Observable<boolean>;

  private loadingSubject = new BehaviorSubject<boolean>(false)

  constructor() {
    this.loading$ = this.loadingSubject.asObservable();
  }

  public showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      switchMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  public loadingOn(): void {
    this.loadingSubject.next(true);
  }

  public loadingOff(): void {
    this.loadingSubject.next(false);
  }

}
