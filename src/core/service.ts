import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class ScrollSpyService {
  public changes$: EventEmitter<any> = new EventEmitter();
  private observables: any = {};

  public getObservable(key: string): any {
    return this.observables[key];
  }

  public setObservable(key: string, observable: ReplaySubject<any> | Observable<any>) {
    this.observables[key] = observable;
    this.observables = this.observables = Object.assign({}, this.observables);
    this.changes$.emit({ index: key, change: 'set' });
  }

  public deleteObservable(key: string) {
    delete this.observables[key];
    this.observables = Object.assign({}, this.observables);
    this.changes$.emit({ index: key, change: 'delete' });
  }
}
