import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule } from '../../index';
import { ScrollSpyIndexDirective } from './index.directive';
import { ScrollSpyIndexRenderDirective } from './index.render.directive';

describe('plugin index.render.directive', () => {

  var fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ScrollSpyModule.forRoot()
      ],
      declarations: [
        RootCmp,
        ScrollSpyIndexDirective,
        ScrollSpyIndexRenderDirective
      ]
    });
  });

  xit('should create index respecting id and selector options',
    fakeAsync(inject([],
      () => {
        fixture = createRoot(RootCmp);
        advance(fixture);

        let compiled = fixture.debugElement.nativeElement.children[0].children[0];
        console.log(compiled);
        let match = compiled.getElementsByClassName('anchor');

        expect(compiled).toEqual(match);
      })));
});

@Component({
  selector: 'root-comp',
  template: `
    <div scrollSpy>
      <div [scrollSpyIndex]="{id: 'test', selector: 'anchor'}">
        <h3 id="test1" class="anchor">test1</h3>
        <h3 id="test2" class="anchor">test2</h3>
        <h3 id="test3" class="anchor">test3</h3>
      </div>
      <div scrollSpy [scrollSpyIndexRender]="{id: 'test', spyId: 'window', topMargin: 90}"></div>
    </div>
  `
})
class RootCmp {}
