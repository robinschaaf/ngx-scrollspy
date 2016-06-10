import {
  Directive,
  Injectable,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';

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

    this.parentEl = getDOM().parentElement(this.el);
    this.elementTop = getDOM().getProperty(this.parentEl, 'scrollTop');
    this.elementBottom = this.elementTop + getDOM().getBoundingClientRect(this.parentEl).height;

    if (!!this.scrollSpy.getObservable('window')) {
      // TODO: Remove setTimeout once: https://github.com/angular/angular/issues/7443
      this.scrollStream$ = this.scrollSpy.getObservable('window').subscribe((e: any) => {
        setTimeout(() => this.update(e.target.scrollingElement.scrollTop));
      });
    }
  }

  update(currentTop: number) {
    if (currentTop >= this.elementTop + this.options.topMargin) {
      if (currentTop > this.elementBottom - this.options.bottomMargin - getDOM().getBoundingClientRect(this.el).height) {
        this.affixTop = false;
        this.affixBottom = true;
      } else {
        this.affixTop = true;
        this.affixBottom = false;
      }
    } else {
      this.affixTop = false;
    }
  }

  ngOnDestroy() {
    this.scrollStream$.unsubscribe();
  }
}
