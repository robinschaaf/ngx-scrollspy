import {
  Directive,
  Injectable,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { ScrollSpyService } from '../index';

export interface ScrollSpyAffixOptions {
  topMargin?: number;
  bottomMargin?: number;
}

@Injectable()
@Directive({
  selector: '[scrollSpyAffix]',
  host: {
    '[class.affixTop]': 'affixTop',
    '[class.affixBottom]': 'affixBottom'
  }
})
export class ScrollSpyAffixDirective implements AfterViewInit, OnDestroy {
  @Input('scrollSpyAffix') options: ScrollSpyAffixOptions;

  private defaultOptions: ScrollSpyAffixOptions = {
    topMargin: 0,
    bottomMargin: 0
  };

  private scrollStream$: any;

  private el: HTMLElement;
  private parentEl: any;

  private elementTop: number;
  private elementBottom: number;
  private affixTop: boolean = false;
  private affixBottom: boolean = false;

  constructor(
    private ref: ChangeDetectorRef,
    private elRef: ElementRef,
    private scrollSpy: ScrollSpyService
  ) {
    this.el = elRef.nativeElement;
  }

  ngAfterViewInit() {
    if (!this.options) {
      this.options = {};
    }

    this.options = Object.assign(this.defaultOptions, this.options);

    this.parentEl = this.el.parentElement;
    this.elementTop = this.parentEl.scrollTop;
    this.elementBottom = this.elementTop + this.parentEl.getBoundingClientRect().height;

    if (!!this.scrollSpy.getObservable('window')) {
      // TODO: Remove setTimeout once: https://github.com/angular/angular/issues/7443
      this.scrollStream$ = this.scrollSpy.getObservable('window').subscribe((e: any) => {
        if (typeof e.target.scrollingElement !== 'undefined') {
          setTimeout(() => this.update(e.target.scrollingElement.scrollTop));
        } else if (typeof e.target.scrollY !== 'undefined') {
          setTimeout(() => this.update(e.target.scrollY));
        }
      });
    }
  }

  update(currentTop: number) {
    if (currentTop >= this.elementTop + this.options.topMargin) {
      if (currentTop > this.elementBottom - this.options.bottomMargin - this.el.getBoundingClientRect().height) {
        if (this.affixTop || !this.affixBottom) {
          this.ref.markForCheck();
        }
        this.affixTop = false;
        this.affixBottom = true;
      } else {
        if (!this.affixTop || this.affixBottom) {
          this.ref.markForCheck();
        }
        this.affixTop = true;
        this.affixBottom = false;
      }
    } else {
      if (this.affixTop) {
        this.ref.markForCheck();
      }
      this.affixTop = false;
      this.affixBottom = false;
    }
  }

  ngOnDestroy() {
    this.scrollStream$.unsubscribe();
  }
}
