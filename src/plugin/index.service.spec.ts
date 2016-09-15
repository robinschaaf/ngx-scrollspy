import { ScrollSpyIndexService } from './index.service';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

describe('plugin index.service', () => {
  let scrollSpyIndexService: ScrollSpyIndexService;

  beforeEach(() => {
    scrollSpyIndexService = new ScrollSpyIndexService();
  });

  it('is defined', () => {
    expect(ScrollSpyIndexService).toBeDefined();
  });

  it('should set/get indexes', () => {
    scrollSpyIndexService.setIndex('test', 'test index');
    var testSubject = scrollSpyIndexService.getIndex('test');

    expect(testSubject).toBe('test index');
  });

  it('should delete indexes', () => {
    scrollSpyIndexService.setIndex('test', 'test index');
    scrollSpyIndexService.deleteIndex('test');
    var testSubject = scrollSpyIndexService.getIndex('test');

    expect(testSubject).not.toBeDefined();
  });
});
