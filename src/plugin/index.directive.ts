import {Directive, Injectable, ElementRef, Input, OnInit, AfterViewInit, OnDestroy} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';

import {ScrollSpyIndexService} from './index.service';

export interface ScrollSpyIndexOptions {
	id?: string;
	selector?: string;
}

@Injectable()
@Directive({
	selector: '[scrollSpyIndex]',
	providers: [
		BrowserDomAdapter
	]
})
export class ScrollSpyIndexDirective implements OnInit, AfterViewInit, OnDestroy {
	@Input('scrollSpyIndex') options: ScrollSpyIndexOptions;

	private defaultOptions: ScrollSpyIndexOptions = {
		selector: 'anchor'
	};

	private el: HTMLElement;

	constructor(
		private DOM: BrowserDomAdapter,
		private elRef: ElementRef,
		private scrollSpyIndex: ScrollSpyIndexService
	) {
		this.el = elRef.nativeElement;
	}

	ngOnInit() {
		if (!this.options) {
			this.options = {};
		}

		if (!this.options.id) {
			return console.warn('ScrollSpyIndex: Missing id.');
		}

		this.options = Object.assign(this.defaultOptions, this.options);
	}

	ngAfterViewInit() {
		this.scrollSpyIndex.setIndex(this.options.id, this.DOM.getElementsByClassName(this.el, this.options.selector));
	}

	ngOnDestroy() {
    this.scrollSpyIndex.deleteIndex(this.options.id);
  }
}
