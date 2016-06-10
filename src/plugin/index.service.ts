import { Injectable, EventEmitter } from '@angular/core';
import { Map } from 'immutable';

@Injectable()
export class ScrollSpyIndexService {
  public changes$: EventEmitter<any> = new EventEmitter();
  private indexes: Map<string, any> = Map({});

  public getIndex(key: string): any {
    return this.indexes.get(key);
  }

  public setIndex(key: string, index: any) {
    this.indexes = this.indexes.set(key, index);
    this.changes$.emit({ index: key, change: 'set' });
  }

  public deleteIndex(key: string) {
    this.indexes = this.indexes.delete(key);
    this.changes$.emit({ index: key, change: 'delete' });
  }
}
