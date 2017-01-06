import { Component } from '@angular/core';

import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule } from '../index';
import { ScrollSpyIndexDirective } from './index.directive';
import { ScrollSpyIndexRenderComponent } from './index.component';

describe('plugin index.render.directive', () => {

  var fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ScrollSpyModule.forRoot()
      ],
      declarations: [
        ScrollSpyIndexRenderComponent,
        ScrollSpyIndexDirective,
        RootCmp
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create index respecting id and selector options',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);

        let compiled = fixture.debugElement.nativeElement;
        let match = compiled.getElementsByTagName('scrollspy-index-render')[0].outerHTML;

        expect(match).toContain('<a ng-reflect-fragment="test1" ng-reflect-href="/#test1" href="/#test1">test1</a>');
        expect(match).toContain('<a ng-reflect-fragment="test2" ng-reflect-href="/#test2" href="/#test2">test2</a>');
        expect(match).toContain('<a ng-reflect-fragment="test3" ng-reflect-href="/#test3" href="/#test3">test3</a>');
        expect(match).toContain('<a ng-reflect-fragment="test3-child" ng-reflect-href="/#test3-child" href="/#test3-child">test3-child</a>');
        expect(match).toContain('<a ng-reflect-fragment="test3-child-child" ng-reflect-href="/#test3-child-child" href="/#test3-child-child">test3-child-child</a>');
      })));

  it('should highlight base on spyId',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);

        let compiled = fixture.debugElement.nativeElement;
        window.scrollTo(0, 0);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        let match = compiled.getElementsByClassName('active')[0].outerHTML;
        expect(match).toContain('<a ng-reflect-fragment="test1" ng-reflect-href="/#test1" href="/#test1">test1</a>');

        window.scrollTo(0, 3100);
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        match = compiled.getElementsByClassName('active');

        expect(match.length).toEqual(2);
        expect(match[0].outerHTML).toContain('<a ng-reflect-fragment="test3" ng-reflect-href="/#test3" href="/#test3">test3</a>');
        expect(match[1].outerHTML).toContain('<a ng-reflect-fragment="test3-child" ng-reflect-href="/#test3-child" href="/#test3-child">test3-child</a>');
      })));

  it('should highlight respecting topMargin',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);

        let compiled = fixture.debugElement.nativeElement;
        window.scrollTo(0, 500);
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        let match = compiled.getElementsByClassName('active')[0].outerHTML;
        expect(match).toContain('<a ng-reflect-fragment="test1" ng-reflect-href="/#test1" href="/#test1">test1</a>');

        window.scrollTo(0, 900);
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        match = compiled.getElementsByClassName('active')[0].outerHTML;
        expect(match).toContain('<a ng-reflect-fragment="test2" ng-reflect-href="/#test2" href="/#test2">test2</a>');
      })));
});

@Component({
  selector: 'root-comp',
  template: `
    <div scrollSpy>
      <div [scrollSpyIndex]="{id: 'test', selector: 'anchor'}" >
        <h3 id="test1" class="anchor" style="height: 1000px;">test1</h3>
        <h3 id="test2" class="anchor" style="height: 1000px;">test2</h3>
        <h3 id="test3" class="anchor" style="height: 1000px;">test3</h3>
        <h4 id="test3-child" class="anchor" style="height: 1000px;">test3-child</h4>
        <h5 id="test3-child-child" class="anchor" style="height: 1000px;">test3-child-child</h5>
        <h3 id="test4" class="anchor" style="height: 1000px;">test4</h3>
        <h4 id="test4-child" class="anchor" style="height: 1000px;">test4-child</h4>
        <h5 id="test4-child-child" class="anchor" style="height: 1000px;">test4-child-child</h5>
      </div>
      <scrollSpy-index-render [scrollSpyIndexRenderOptions]="{id: 'test', spyId: 'window', topMargin: -200}"></scrollSpy-index-render>
    </div>
  `
})
class RootCmp {}
