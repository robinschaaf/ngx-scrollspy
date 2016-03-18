import {Directive, Injectable, Input, Output, ElementRef, EventEmitter, OnInit, AfterViewInit, OnDestroy} from 'angular2/core';

import {ScrollSpyService} from '../index';

export interface ScrollSpyInfiniteOptions {
	spyId?: string;
	distanceRatio?: number;
}

@Injectable()
@Directive({
	selector: '[scrollSpyInfinite]'
})
export class ScrollSpyInfiniteDirective implements OnInit, AfterViewInit, OnDestroy {
	@Input('scrollSpyInfinite') options: ScrollSpyInfiniteOptions;
	@Input() scrollSpyInfiniteDisabled: boolean;

	@Output() scrollSpyInfiniteEvent: EventEmitter<any> = new EventEmitter();

	private defaultOptions: ScrollSpyInfiniteOptions = {
		spyId: 'window',
		distanceRatio: 1
	};

	private _scrollStream: any;

	private el: HTMLElement;

	private currentScrollElement: any;

	constructor(
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

		if (this.scrollSpyInfiniteDisabled === undefined) {
			this.scrollSpyInfiniteDisabled = false;
		}
	}

	ngAfterViewInit() {
		if (!!this.scrollSpy.getObservable(this.options.spyId)) {
			this._scrollStream = this.scrollSpy.getObservable(this.options.spyId).throttleTime(200).subscribe((e: any) => {
				if (this.options.spyId === 'window') {
					this.currentScrollElement = e.target;
				} else {
					this.currentScrollElement = e.target;
				}
				this.evaluateScroll();
			});
		} else {
			return console.warn('ScrollSpyInfinite: No ScrollSpy observable for id "' + this.options.spyId + '"');
		}
	}

	evaluateScroll() {
		if (!this.scrollSpyInfiniteDisabled) {
			if (this.options.spyId === 'window') {
				if (this.currentScrollElement.scrollingElement.scrollHeight - this.currentScrollElement.scrollingElement.scrollTop - this.currentScrollElement.documentElement.clientHeight <= this.currentScrollElement.documentElement.clientHeight * this.options.distanceRatio + 1) {
					this.scrollSpyInfiniteEvent.next({});
				}
			} else {
				if (this.currentScrollElement.scrollHeight - this.currentScrollElement.scrollTop - this.currentScrollElement.offsetHeight <= this.currentScrollElement.offsetHeight * this.options.distanceRatio + 1) {
					this.scrollSpyInfiniteEvent.next({});
				}
			}
		}
	}

	ngOnDestroy() {
		this._scrollStream.unsubscribe();
  }
}
