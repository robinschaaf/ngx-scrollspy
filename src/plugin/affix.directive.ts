import {Directive, Injectable, ElementRef, Input, AfterViewInit, OnDestroy} from '@angular/core';
import {DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';

import {ScrollSpyService} from '../index';

export interface ScrollSpyAffixOptions {
	topMargin?: number;
	bottomMargin?: number;
}

@Injectable()
@Directive({
	selector: '[scrollSpyAffix]',
	providers: [
		DomAdapter
	],
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

	private _scrollStream: any;

	private el: HTMLElement;
	private parentEl: any;

	private elementTop: number;
	private elementBottom: number;
	private affixTop: boolean = false;
	private affixBottom: boolean = false;

	constructor(
		private DOM: DomAdapter,
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

		this.parentEl = this.DOM.parentElement(this.el);
		this.elementTop = this.DOM.getProperty(this.parentEl, 'scrollTop');
		this.elementBottom = this.elementTop + this.DOM.getBoundingClientRect(this.parentEl).height;

		if (!!this.scrollSpy.getObservable('window')) {
			//TODO: Remove delay once: https://github.com/angular/angular/issues/7443
			this._scrollStream = this.scrollSpy.getObservable('window').delay(0).subscribe((e: any) => {
				this.update(e.target.scrollingElement.scrollTop);
			});
		}
	}

	update(currentTop: number) {
		if (currentTop >= this.elementTop + this.options.topMargin) {
			if (currentTop > this.elementBottom - this.options.bottomMargin - this.DOM.getBoundingClientRect(this.el).height) {
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
		this._scrollStream.unsubscribe();
  }
}
