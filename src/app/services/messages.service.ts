import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MessagesService {

  public errors$: Observable<string[]>;

  private errorsSubject = new BehaviorSubject<string[]>([]);

  constructor() {
    this.errors$ = this.errorsSubject.asObservable();
  }

  public showErrors(...errors: string[]): void {
    this.errorsSubject.next(errors);
  }

}
