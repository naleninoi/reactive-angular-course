import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private readonly AUTH_DATA = 'auth_data';

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

    this.getUserProfileFromStorage();
  }

  public get user$(): Observable<User> {
    return this.userSubject.asObservable();
  }

  public login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', {email, password})
      .pipe(
        tap(user => {
          this.userSubject.next(user);
          this.saveUserProfileToStorage(user);
        }),
        shareReplay()
      );
  }

  public logout(): void {
    this.userSubject.next(null);
    this.clearUserProfileFromStorage();
  }

  private saveUserProfileToStorage(user: User): void {
    localStorage.setItem(this.AUTH_DATA, JSON.stringify(user));
  }

  private getUserProfileFromStorage(): void {
    const storageValue = localStorage.getItem(this.AUTH_DATA);
    if (storageValue) {
      const user = JSON.parse(storageValue);
      this.userSubject.next(user);
    }
  }

  private clearUserProfileFromStorage(): void {
    localStorage.removeItem(this.AUTH_DATA);
  }

}
