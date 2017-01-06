import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { ScrollSpyModule } from '../index';
import { ScrollSpyIndexModule } from './index';
import { ScrollSpyIndexService } from './index.service';

describe('plugin index.directive', () => {

  var fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ScrollSpyModule.forRoot(),
        ScrollSpyIndexModule
      ],
      declarations: [
        RootCmp
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create index respecting id and selector options',
    fakeAsync(inject([ScrollSpyIndexService],
      (scrollSpyIndexService: ScrollSpyIndexService) => {
        fixture = createRoot(RootCmp);
        advance(fixture);

        let compiled = fixture.debugElement.nativeElement.children[0];

        var testSubject = scrollSpyIndexService.getIndex('test');
        let match = compiled.getElementsByClassName('anchor');
        
        expect(testSubject).toEqual(match);
      })));
});

@Component({
  selector: 'root-comp',
  template: `
    <div [scrollSpyIndex]="{id: 'test', selector: 'anchor'}">
      <h3 id="test1" class="anchor">test1</h3>
      <h3 id="test2" class="anchor">test2</h3>
      <h3 id="test3" class="anchor">test3</h3>
    </div>
  `
})
class RootCmp {}
