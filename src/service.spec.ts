import {
	it,
	describe
} from 'angular2/testing';

import {ScrollSpyService} from './service';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

export function main() {
	describe('service', () => {

		var fixture: ComponentFixture;

		it('is defined', () => {
			expect(ScrollSpyService).toBeDefined();
		});

	});
}