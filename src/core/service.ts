import { Injectable, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Map } from 'immutable';

@Injectable()
export class ScrollSpyService {
  public changes$: EventEmitter<any> = new EventEmitter();
  private observables: Map<string, any> = Map({});

  public getObservable(key: string): any {
    return this.observables.get(key);
  }

  public setObservable(key: string, observable: ReplaySubject<any>) {
    this.observables = this.observables.set(key, observable);
    this.changes$.emit({ index: key, change: 'set' });
  }

  public deleteObservable(key: string) {
    this.observables = this.observables.delete(key);
    this.changes$.emit({ index: key, change: 'delete' });
  }
}
