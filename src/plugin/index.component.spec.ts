import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule } from '../index';
import { ScrollSpyIndexDirective } from './index.directive';
import { ScrollSpyIndexRenderComponent } from './index.component';

describe('plugin index.render.directive', () => {

  var fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
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
        let match = compiled.getElementsByTagName('scrollspymenu')[0].outerHTML;

        expect(match).toEqual('<scrollspymenu><ul class="nav menu"><li pagemenuspy="test1" parent="" class="active"><a href="#test1">test1</a></li><li pagemenuspy="test2" parent=""><a href="#test2">test2</a></li><li pagemenuspy="test3" parent=""><a href="#test3">test3</a></li></ul></scrollspymenu>');
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
        expect(match).toEqual('<li pagemenuspy="test1" parent="" class="active"><a href="#test1">test1</a></li>');

        window.scrollTo(0, 1100);
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        match = compiled.getElementsByClassName('active')[0].outerHTML;
        expect(match).toEqual('<li pagemenuspy="test2" parent="" class="active"><a href="#test2">test2</a></li>');
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
        expect(match).toEqual('<li pagemenuspy="test1" parent="" class="active"><a href="#test1">test1</a></li>');

        window.scrollTo(0, 900);
        evt.initUIEvent('scroll', true, true, window, 1);
        window.dispatchEvent(evt);
        advance(fixture);

        match = compiled.getElementsByClassName('active')[0].outerHTML;
        expect(match).toEqual('<li pagemenuspy="test2" parent="" class="active"><a href="#test2">test2</a></li>');
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
      </div>
      <scrollSpy-index-render [scrollSpyIndexRenderOptions]="{id: 'test', spyId: 'window', topMargin: -200}"></scrollSpy-index-render>
    </div>
  `
})
class RootCmp {}
