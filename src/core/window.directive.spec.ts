import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule, ScrollSpyService } from '../../index';

describe('core window.directive', () => {

  var fixture: ComponentFixture<any>;
  var EventSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ScrollSpyModule.forRoot()
      ],
      declarations: [ RootCmp ]
    });

    EventSpy = jasmine.createSpy('EventSpy');
  });

  it('should subscribe to window scroll events',
    fakeAsync(inject([ScrollSpyService],
      (scrollSpyService: ScrollSpyService) => {
        fixture = createRoot(RootCmp);
        expect(EventSpy).not.toHaveBeenCalled();

        scrollSpyService.getObservable('window').subscribe((e: any) => EventSpy(e));
        advance(fixture);

        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(EventSpy).toHaveBeenCalledWith(evt);
      })));
});

@Component({
  selector: 'root-comp',
  template: `<div scrollSpy></div>`
})
class RootCmp {}
