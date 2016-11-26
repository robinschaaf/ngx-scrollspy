import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ScrollSpyIndexService {
  public changes$: EventEmitter<any> = new EventEmitter();
  private indexes: any = {};

  public getIndex(key: string): any {
    return this.indexes[key];
  }

  public setIndex(key: string, index: any) {
    this.indexes[key] = index;
    this.indexes = this.indexes = Object.assign({}, this.indexes);
    this.changes$.emit({ index: key, change: 'set' });
  }

  public deleteIndex(key: string) {
    delete this.indexes[key];
    this.indexes = Object.assign({}, this.indexes);
    this.changes$.emit({ index: key, change: 'delete' });
  }
}
