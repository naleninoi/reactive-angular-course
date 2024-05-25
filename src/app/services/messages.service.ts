import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MessagesService {

  public errors$: Observable<string[]>;

  private errorsSubject = new BehaviorSubject<string[]>([]);

  constructor() {
    this.errors$ = this.errorsSubject.asObservable()
      .pipe(filter(messages => messages && messages.length > 0));
  }

  public showErrors(...errors: string[]): void {
    this.errorsSubject.next(errors);
  }

}
