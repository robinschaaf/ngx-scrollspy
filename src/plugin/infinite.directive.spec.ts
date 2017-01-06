import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject, tick } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule } from '../index';
import { ScrollSpyInfiniteModule } from './infinite';

describe('plugin infinite.directive', () => {

  var fixture: ComponentFixture<any>;
  var EventSpy: any;
  var ScrollIsDisabled = false;

  beforeEach(() => {
    EventSpy = jasmine.createSpy('EventSpy');

    TestBed.configureTestingModule({
      imports: [
        ScrollSpyModule.forRoot(),
        ScrollSpyInfiniteModule
      ],
      declarations: [
        RootCmp,
        RootElementCmp
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should trigger infinitescroll event in window',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);

        window.scrollTo(0, 3000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        tick(400);
        fixture.detectChanges();

        expect(EventSpy).toHaveBeenCalledWith('scrolled');
      })));

  it('should trigger infinitescroll event in element',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootElementCmp);
        advance(fixture);

        let element = fixture.debugElement.nativeElement.children[0];
        element.scrollTop = 600;
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        element.dispatchEvent(evt);
        tick(400);
        fixture.detectChanges();

        expect(EventSpy).toHaveBeenCalledWith('scrolled');
      })));

  it('should respect distanceRatio on window',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);
        
        const scrollHeight = window.document.documentElement.scrollHeight;
        const clientHeight = window.document.documentElement.clientHeight;

        window.scrollTo(0, scrollHeight - clientHeight / 2 - clientHeight - 1);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        tick(400);
        fixture.detectChanges();

        expect(EventSpy).not.toHaveBeenCalledWith('scrolled');

        window.scrollTo(0, scrollHeight - clientHeight / 2);
        evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        tick(400);
        fixture.detectChanges();

        expect(EventSpy).toHaveBeenCalledWith('scrolled');
      })));

  it('should respect distanceRatio on element',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootElementCmp);
        advance(fixture);

        let element = fixture.debugElement.nativeElement.children[0];
        element.scrollTop = 399;
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        element.dispatchEvent(evt);
        tick(400);
        fixture.detectChanges();

        expect(EventSpy).not.toHaveBeenCalledWith('scrolled');

        element.scrollTop = 400;
        evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        element.dispatchEvent(evt);
        tick(400);
        fixture.detectChanges();

        expect(EventSpy).toHaveBeenCalledWith('scrolled');
      })));

  it('should respect scrollSpyInfiniteDisabled',
    fakeAsync(inject([],
      () => {
        ScrollIsDisabled = true;
        fixture = createRoot(RootCmp);
        advance(fixture);

        window.scrollTo(0, 3000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        tick(400);
        fixture.detectChanges();

        expect(EventSpy).not.toHaveBeenCalledWith('scrolled');
      })));

  @Component({
    selector: 'root-comp',
    template: `
      <div scrollSpy [scrollSpyInfinite]="{distanceRatio: 0.5}" (scrollSpyInfiniteEvent)="scrolled()" [scrollSpyInfiniteDisabled]="scrollDisabled()" style="height: 3000px;">
      </div>
    `
  })
  class RootCmp {
    public scrolled() {
      EventSpy('scrolled');
    }

    public scrollDisabled() {
      return ScrollIsDisabled;
    }
  }

  @Component({
    selector: 'root-comp',
    template: `
      <div scrollSpyElement='test' [scrollSpyInfinite]="{spyId: 'test', distanceRatio: 0.5}" (scrollSpyInfiniteEvent)="scrolled()" style="max-height: 400px; overflow: scroll;">
        <div style="height: 1000px;"></div>
      </div>
    `
  })
  class RootElementCmp {
    public scrolled() {
      EventSpy('scrolled');
    }
  }
});
