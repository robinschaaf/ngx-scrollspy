import { ScrollSpyService } from './service';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

export function main() {
	describe('service', () => {

		it('is defined', () => {
			expect(ScrollSpyService).toBeDefined();
		});

	});
}
