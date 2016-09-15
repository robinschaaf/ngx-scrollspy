import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule } from '../../index';
import { ScrollSpyAffixDirective } from './affix.directive';

describe('plugin affix.directive', () => {

  var fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ScrollSpyModule.forRoot()
      ],
      declarations: [
        RootCmp,
        ScrollSpyAffixDirective
      ]
    });
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

        expect(compiled.className).toEqual('affixTop');
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

        expect(compiled.className).toEqual('affixBottom');
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

        expect(compiled.className).toEqual('affixTop');

        window.scrollTo(0, 0);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).not.toEqual('affixTop');
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

        expect(compiled.className).toEqual('affixBottom');

        window.scrollTo(0, 0);
        window.dispatchEvent(evt);
        advance(fixture);

        expect(compiled.className).not.toEqual('affixBottom');
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

        expect(compiled.className).not.toEqual('affixTop');
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

        expect(compiled.className).not.toEqual('affixBottom');
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
