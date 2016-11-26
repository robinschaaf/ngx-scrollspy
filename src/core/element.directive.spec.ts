import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule, ScrollSpyService } from '../index';
import { ScrollSpyElementDirective } from './element.directive';

describe('core element.directive', () => {

  var fixture: ComponentFixture<any>;
  var EventSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ScrollSpyModule.forRoot()
      ],
      declarations: [
        RootCmp,
        ScrollSpyElementDirective
      ]
    });

    EventSpy = jasmine.createSpy('EventSpy');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should subscribe to element scroll events',
    fakeAsync(inject([ScrollSpyService],
      (scrollSpyService: ScrollSpyService) => {
        fixture = createRoot(RootCmp);
        expect(EventSpy).not.toHaveBeenCalled();

        scrollSpyService.getObservable('test').subscribe((e: any) => EventSpy(e));
        advance(fixture);

        let compiled = fixture.debugElement.nativeElement.children[0];
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        compiled.dispatchEvent(evt);
        advance(fixture);

        expect(EventSpy).toHaveBeenCalledWith(evt);
      })));
});

@Component({
  selector: 'root-comp',
  template: `<div scrollSpyElement='test'></div>`
})
class RootCmp {}
