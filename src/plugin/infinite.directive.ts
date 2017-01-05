import {
  Directive,
  Injectable,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { ScrollSpyService } from '../index';

export interface ScrollSpyInfiniteOptions {
  spyId?: string;
  distanceRatio?: number;
}

@Injectable()
@Directive({
  selector: '[scrollSpyInfinite]'
})
export class ScrollSpyInfiniteDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input('scrollSpyInfinite') public options: ScrollSpyInfiniteOptions;
  @Input() public scrollSpyInfiniteDisabled: boolean;

  @Output() public scrollSpyInfiniteEvent: EventEmitter<any> = new EventEmitter();

  public defaultOptions: ScrollSpyInfiniteOptions = {
    spyId: 'window',
    distanceRatio: 1
  };

  public scrollStream$: any;

  constructor(
    private scrollSpy: ScrollSpyService
  ) {}

  ngOnInit() {
    if (!this.options) {
      this.options = {};
    }

    this.options = Object.assign(this.defaultOptions, this.options);

    if (this.scrollSpyInfiniteDisabled === undefined) {
      this.scrollSpyInfiniteDisabled = false;
    }
  }

  ngAfterViewInit() {
    if (!!this.scrollSpy.getObservable(this.options.spyId)) {
      this.scrollStream$ = this.scrollSpy.getObservable(this.options.spyId).throttleTime(200).subscribe((e: any) => {
        if (!this.scrollSpyInfiniteDisabled) {
          this.evaluateScroll(e.target);
        }
      });
    } else {
      return console.warn('ScrollSpyInfinite: No ScrollSpy observable for id "' + this.options.spyId + '"');
    }
  }

  evaluateScroll(target: any) {
    if (this.options.spyId === 'window') {
      const scrollHeight = target.document.documentElement.scrollHeight;
      const scrollTop = target.scrollY;
      const offsetHeight = target.document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - offsetHeight <= offsetHeight * this.options.distanceRatio) {
        this.scrollSpyInfiniteEvent.next({});
      }
    } else {
      const scrollHeight = target.scrollingElement ?
        target.scrollingElement.scrollHeight
        : target.scrollHeight;

      const scrollTop = target.scrollingElement ?
        target.scrollingElement.scrollTop
        : target.scrollTop;

      const offsetHeight = target.scrollingElement ?
        target.scrollingElement.offsetHeight
        : target.offsetHeight;

      if (scrollHeight - scrollTop - offsetHeight <= offsetHeight * this.options.distanceRatio) {
        this.scrollSpyInfiniteEvent.next({});
      }
    }
  }

  ngOnDestroy() {
    this.scrollStream$.unsubscribe();
  }
}
