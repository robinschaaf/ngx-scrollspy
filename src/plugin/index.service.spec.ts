import { ScrollSpyIndexService } from './index.service';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

export function main() {
	describe('index service', () => {

		it('is defined', () => {
			expect(ScrollSpyIndexService).toBeDefined();
		});

	});
}
