import {
  Directive,
  Injectable,
  Input,
  ElementRef,
  Renderer,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { ScrollSpyService } from '../index';

export interface ScrollSpyParallaxOptions {
  // (default: 'window')
  spyId?: string;

  // (default: false)
  horizontal?: boolean;

  // the css property (converted to camelCase) that you want changed along with the
  // value you want to assign to the css key; you should use ParallaxCss if you're 
  // just defining one property without special values
  cssKey?: string;

  // this is used to define the css property you'd like to modify as you scroll
  // default is backgroundPositionY
  property?: string;

  // ratio defining how fast, slow, or the direction of the changes on scrolling
  ratio?: number;

  // this is the initial value in pixels for the parallaxCss property you defined
  // before or, if you didn't define one, it defaults to 0
  initValue?: number;

  // the upper constraint for the css transformation
  max?: number;

  // the lower constraint for the css transformation
  min?: number;

  // the unit (e.g. 'px', 'em', '%', 'vh', etc.)
  unit?: string;

  axis?: string;
}

@Injectable()
@Directive({
  selector: '[scrollSpyParallax]'
})
export class ScrollSpyParallaxDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input('scrollSpyParallax') public options: ScrollSpyParallaxOptions;
  @Input() public scrollSpyParallaxDisabled: boolean;

  public cssValue: string;
  public isSpecialVal: boolean = false;
  
  public defaultOptions: ScrollSpyParallaxOptions = {
    spyId: 'window',
    horizontal: false,
    cssKey: 'backgroundPosition',
    property: 'backgroundPositionY',
    ratio: -.7,
    initValue: 0,
    unit: 'px',
    axis: 'Y'
  };

  public scrollStream$: any;

  public el: HTMLElement;

  constructor(
    private renderer: Renderer,
    private elRef: ElementRef,
    private scrollSpy: ScrollSpyService
  ) {
    this.el = elRef.nativeElement;
  }

  ngOnInit() {
    if (!this.options) {
      this.options = {};
    }

    this.options = Object.assign(this.defaultOptions, this.options);

    if (this.scrollSpyParallaxDisabled === undefined) {
      this.scrollSpyParallaxDisabled = false;
    }

    if (this.options.property.match(/backgroundPosition/i)) {
      if (this.options.property.split('backgroundPosition')[1].toUpperCase() === 'X') {
        this.options.axis = 'X';
      }

      this.options.property = 'backgroundPosition';
    }

    let cssValArray: Array<string>;

    cssValArray = this.options.property.split(':');
    this.options.cssKey = cssValArray[0];
    this.cssValue = cssValArray[1];

    this.isSpecialVal = this.cssValue ? true : false;

    if (!this.cssValue) {
      this.cssValue = this.options.cssKey;
    }

    this.options.ratio = +this.options.ratio;
    this.options.initValue = +this.options.initValue;

  }

  ngAfterViewInit() {
    if (!!this.scrollSpy.getObservable(this.options.spyId)) {
      this.scrollStream$ = this.scrollSpy.getObservable(this.options.spyId).subscribe((e: any) => {
        if (!this.scrollSpyParallaxDisabled) {
          this.evaluateScroll(e.target);
        }
      });
    } else {
      return console.warn('ScrollSpyParallax: No ScrollSpy observable for id "' + this.options.spyId + '"');
    }
  }

  evaluateScroll(target: any) {
    let currentScrollPosition: number;
    if (typeof target.scrollTop !== 'undefined') {
      currentScrollPosition = target.scrollTop;
    } else if (typeof target.scrollingElement !== 'undefined') {
      currentScrollPosition = target.scrollingElement.scrollTop;
    } else if (typeof target.scrollY !== 'undefined') {
      currentScrollPosition = target.scrollY;
    }

    let result: string;
    let value: number;

    value = currentScrollPosition * this.options.ratio + this.options.initValue;
    
    if (this.options.max !== undefined && currentScrollPosition >= this.options.max) {
      currentScrollPosition = this.options.max;
    } else if (this.options.min !== undefined && currentScrollPosition <= this.options.min) {
      currentScrollPosition = this.options.min;
    }

    // added after realizing original setup wasn't compatible in Firefox debugger;
    if (this.options.cssKey === 'backgroundPosition') {
      if (this.options.axis === 'X') {
        result = value + this.options.unit + ' 0';
      } else {
        result = '0 ' + value + this.options.unit;
      }
    } else if (this.isSpecialVal) {
      result = this.cssValue + '(' + value + this.options.unit + ')';
    } else {
      result = value + this.options.unit;
    }

    this.renderer.setElementStyle(this.el, this.options.cssKey, result);
  }

  ngOnDestroy() {
    this.scrollStream$.unsubscribe();
  }
}
