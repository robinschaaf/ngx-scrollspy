import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule } from '../index';
import { ScrollSpyElementDirective } from '../index';
import { ScrollSpyParallaxDirective } from './parallax.directive';

describe('plugin parallax.directive', () => {

  var fixture: ComponentFixture<any>;
  var ScrollIsDisabled = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ScrollSpyModule.forRoot()
      ],
      declarations: [
        RootCmp,
        RootElementCmp,
        ScrollSpyElementDirective,
        ScrollSpyParallaxDirective
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should work on window',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);

        window.scrollTo(0, 3000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        let element = fixture.debugElement.nativeElement.children[0];

        expect(element.style.backgroundPositionY).toEqual('-1789.9px');
      })));

  it('should work on element',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootElementCmp);
        advance(fixture);

        let scrollElement = fixture.debugElement.nativeElement.children[1];

        scrollElement.scrollTop = 600;
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        scrollElement.dispatchEvent(evt);
        advance(fixture);

        let element = fixture.debugElement.nativeElement.children[0];

        expect(element.style.backgroundPositionY).toEqual('-420px');
      })));

 it('should respect scrollSpyParallaxDisabled',
    fakeAsync(inject([],
      () => {
        ScrollIsDisabled = true;
        fixture = createRoot(RootCmp);
        advance(fixture);

        window.scrollTo(0, 3000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        let element = fixture.debugElement.nativeElement.children[0];

        expect(element.style.backgroundPositionY).not.toEqual('-1789.9px');
      })));

  xit('should do horizontal parallax',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);
      })));

  xit('should respect different cssKey and property',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);
      })));

  xit('should respect ratio',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);
      })));

  xit('should respect initValue',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);
      })));

  xit('should respect unit',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);
      })));

  xit('should respect axis',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);
      })));

  @Component({
    selector: 'root-comp',
    template: `
      <div scrollSpy [scrollSpyParallax]="{}" style="width: 700px; height: 300px;" [scrollSpyParallaxDisabled]="scrollDisabled()"></div>
      <div style="height: 3000px;"></div>
    `
  })
  class RootCmp {
    public scrollDisabled() {
      return ScrollIsDisabled;
    }
  }

  @Component({
    selector: 'root-comp',
    template: `
      <div [scrollSpyParallax]="{spyId: 'test'}" style="width: 700px; height: 300px;"></div>
      <div scrollSpyElement='test' style="max-height: 400px; overflow: scroll;">
        <div style="height: 1000px;"></div>
      </div>
    `
  })
  class RootElementCmp { }
});
