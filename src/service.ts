///<reference path='./../node_modules/immutable/dist/immutable.d.ts'/>

import {Injectable} from 'angular2/core';
import {Map} from 'immutable';

@Injectable()
export class ScrollSpyService {
	public debug: Boolean = false;
	
	private observables: Map<string, any> = Map({});

	public getObservable(key: string) {
		return this.observables.get(key);
	}

	public setObservable(key: string, observable: any) {
		this.observables = this.observables.set(key, observable);
	}

	public deleteObservable(key: string) {
		this.observables = this.observables.delete(key);
	}
}
