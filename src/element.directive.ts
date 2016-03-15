import {Directive, Injectable, EventEmitter, Input, OnInit, OnDestroy} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {ScrollSpyService} from './service';

@Injectable()
@Directive({
	selector: '[scrollSpyElement]',
	providers: [
		ScrollSpyService
	],
	host: {
    '(scroll)': 'onScroll($event)'
  }
})
export class ScrollSpyElementDirective implements OnInit, OnDestroy {
	@Input('scrollSpyElement') scrollSpyId: string;

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

		if (!!this.scrollSpyId) {
			return console.warn('ScrollSpy: Missing id.');
		}

		if (!!this.scrollSpy.getObservable(this.scrollSpyId)) {
			console.warn('ScrollSpy: duplicate id "' + this.scrollSpyId + '". Instance will be skipped!');
		} else {
			this.scrollSpy.setObservable(this.scrollSpyId, this._scrollStream);
		}

		if (!!this.scrollSpy.debug) {
			this._scrollStream.subscribe((e: any) => {
				console.log('ScrollSpy::' + this.scrollSpyId + ': ' + e);
			});
		}
	}

	ngOnDestroy() {
    delete this.scrollSpy.deleteObservable(this.scrollSpyId);
  }

	onScroll($event: any) {
		this._scrollStream.emit($event);
	}
}
