import {Directive, Injectable, EventEmitter, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {ScrollSpyService} from './service';

@Injectable()
@Directive({
	selector: '[scrollSpy]',
	providers: [
		ScrollSpyService
	],
	host: {
    '(window.scroll)': 'onScroll($event)'
  }
})
export class ScrollSpyDirective implements OnInit {
	private _scrollStream: EventEmitter<any> = new EventEmitter();

	constructor(
		private scrollSpy: ScrollSpyService
	) {}

	ngOnInit() {
		this._scrollStream.flatMap((e) => {
			return Observable
				.of(e)
				.distinctUntilChanged();
		});

		if (!!this.scrollSpy.getObservable('window')) {
			console.warn('ScrollSpy: duplicate id "window". Instance will be skipped!');
		} else {
			this.scrollSpy.setObservable('window', this._scrollStream);
		}

		if (!!this.scrollSpy.debug) {
			this._scrollStream.subscribe((e: any) => {
				console.log('ScrollSpy::window: ' + e);
			});
		}
	}

	onScroll($event: any) {
		this._scrollStream.emit($event);
	}
}
