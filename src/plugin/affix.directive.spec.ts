import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule } from '../index';
import { ScrollSpyAffixModule } from './affix';

describe('plugin affix.directive', () => {

  var fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ScrollSpyModule.forRoot(),
        ScrollSpyAffixModule
      ],
      declarations: [
        RootCmp
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should affix class affixTop',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);

        let compiled = fixture.debugElement.nativeElement.children[0].children[0];
        window.scrollTo(0, 1000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).toContain('affix');
        expect(compiled.className).toContain('affix-top');
      })));

  it('should affix class affixBottom',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);

        let compiled = fixture.debugElement.nativeElement.children[0].children[0];
        window.scrollTo(0, 3000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).toContain('affix');
        expect(compiled.className).toContain('affix-bottom');
      })));

  it('should remove class affixTop',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);

        let compiled = fixture.debugElement.nativeElement.children[0].children[0];
        window.scrollTo(0, 1000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).toContain('affix');
        expect(compiled.className).toContain('affix-top');

        window.scrollTo(0, 0);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).not.toContain('affix');
        expect(compiled.className).not.toContain('affix-top');
      })));

  it('should remove class affixBottom',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);

        let compiled = fixture.debugElement.nativeElement.children[0].children[0];
        window.scrollTo(0, 3000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).toContain('affix');
        expect(compiled.className).toContain('affix-bottom');

        window.scrollTo(0, 0);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).not.toContain('affix');
        expect(compiled.className).not.toContain('affix-bottom');
      })));

  it('should respect topMargin',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);

        let compiled = fixture.debugElement.nativeElement.children[0].children[0];
        window.scrollTo(0, 200);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).not.toContain('affix');
        expect(compiled.className).not.toContain('affix-top');
      })));

  it('should respect bottomMargin',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);

        let compiled = fixture.debugElement.nativeElement.children[0].children[0];
        window.scrollTo(0, 2000);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).toContain('affix');
        expect(compiled.className).not.toContain('affix-bottom');
      })));
});

@Component({
  selector: 'root-comp',
  template: `
    <div scrollSpy style="height: 3000px; margin-bottom: 1000px;">
      <div [scrollSpyAffix]="{topMargin: 500, bottomMargin: 500}"></div>
    </div>
  `
})
class RootCmp {}
