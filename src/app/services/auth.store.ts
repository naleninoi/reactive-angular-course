import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private userSubject = new BehaviorSubject<User>(null);

  public isLoggedIn$: Observable<boolean>;

  public isLoggedOut$: Observable<boolean>;

  constructor(
    private http: HttpClient
  ) {
    this.isLoggedIn$ = this.userSubject.pipe(
      map(user => !!user)
    );

    this.isLoggedOut$ = this.isLoggedIn$.pipe(
      map(isLoggedIn => !isLoggedIn)
    );
  }

  public get user$(): Observable<User> {
    return this.userSubject.asObservable();
  }

  public login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', {email, password})
      .pipe(
        tap(user => this.userSubject.next(user)),
        shareReplay()
      );
  }

  public logout() {
    this.userSubject.next(null);
  }

}
