import {
  Component,
  ChangeDetectorRef,
  Injectable,
  Input,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { ScrollSpyService } from '../core/service';
import { ScrollSpyIndexService } from './index.service';

export interface ScrollSpyIndexComponentOptions {
  id?: string;
  spyId?: string;
  topMargin?: number;
}

@Injectable()
@Component({
  selector: 'scrollSpy-index-render',
  template: `
  <div #container>
    <ul class="nav flex-column menu">
      <li *ngFor="let item of items" [class.active]="highlight(item.link)">
        <a [routerLink]="" fragment="{{item.link}}" (click)="goTo(item.link)">{{item.text}}</a>
        <ul *ngIf="item.children.length" class="nav menu">
          <li *ngFor="let itemChild of item.children" [class.active]="highlight(itemChild.link)">
            <a [routerLink]="" fragment="{{itemChild.link}}" (click)="goTo(itemChild.link)">{{itemChild.text}}</a>
            <ul *ngIf="itemChild.children.length" class="nav menu">
              <li *ngFor="let itemChild1 of itemChild.children" [class.active]="highlight(itemChild1.link)">
                <a [routerLink]="" fragment="{{itemChild1.link}}" (click)="goTo(itemChild1.link)">{{itemChild1.text}}</a>
                 <ul *ngIf="itemChild1.children.length" class="nav menu">
                  <li *ngFor="let itemChild2 of itemChild1.children" [class.active]="highlight(itemChild2.link)">
                    <a [routerLink]="" fragment="{{itemChild2.link}}" (click)="goTo(itemChild2.link)">{{itemChild2.text}}</a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollSpyIndexRenderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public scrollSpyIndexRenderOptions: ScrollSpyIndexComponentOptions;

  public currentScrollPosition: number;
  public items: any[] = [];
  public itemsHash: any = {};
  public itemsToHighlight: Array<string> = [];

  public defaultOptions: ScrollSpyIndexComponentOptions = {
    spyId: 'window',
    topMargin: 0
  };

  public changeStream$: any;
  public scrollStream$: any;

  public el: HTMLElement;

  constructor(
    private ref: ChangeDetectorRef,
    private elRef: ElementRef,
    private scrollSpy: ScrollSpyService,
    private scrollSpyIndex: ScrollSpyIndexService
  ) {
    this.el = elRef.nativeElement;
  }

  ngOnInit() {
    if (!this.scrollSpyIndexRenderOptions) {
      this.scrollSpyIndexRenderOptions = {};
    }

    if (!this.scrollSpyIndexRenderOptions.id) {
      return console.warn('ScrollSpyIndex: Missing id.');
    }

    this.scrollSpyIndexRenderOptions = Object.assign(this.defaultOptions, this.scrollSpyIndexRenderOptions);

    this.changeStream$ = this.scrollSpyIndex.changes$.subscribe((e: any) => {
      if (e.index === this.scrollSpyIndexRenderOptions.id) {
        if (e.change === 'delete') {
          this.update();
        } else if (e.change === 'set') {
          this.update();
        }
      }
    });
  }

  ngAfterViewInit() {
    if (!!this.scrollSpy.getObservable(this.scrollSpyIndexRenderOptions.spyId)) {
      this.scrollStream$ = this.scrollSpy.getObservable(this.scrollSpyIndexRenderOptions.spyId).subscribe((e: any) => {
        if (typeof e.target.scrollingElement !== 'undefined') {
          this.currentScrollPosition = e.target.scrollingElement.scrollTop;
        } else if (typeof e.target.scrollY !== 'undefined') {
          this.currentScrollPosition = e.target.scrollY;
        } else if (typeof e.target.pageYOffset !== 'undefined') {
          this.currentScrollPosition = e.target.pageYOffset;
        }
        this.calculateHighlight();
      });
    } else {
      return console.warn('ScrollSpyIndexComponent: No ScrollSpy observable for id "' + this.scrollSpyIndexRenderOptions.spyId + '"');
    }
  }

  update() {
    const data: Array<any> = this.scrollSpyIndex.getIndex(this.scrollSpyIndexRenderOptions.id) || [];

    let stack: Array<any> = [];
    let parentStack: Array<any> = [];
    let lastItem: any;

    this.items = [];
    this.itemsHash = {};

    for (var i = 0; i < data.length; ++i) {
      // parse basic info from the dom item
      var item: any = {
        link: data[i].id,
        text: data[i].textContent || data[i].innerText,
        parents: [],
        children: []
      };

      // build type identifier
      var level: string = data[i].tagName;
      for (var n = 0; n < data[i].classList.length; n++) {
        level += ',' + data[i].classList[n];
      }

      // here be dragons
      var stacksize: number = stack.length;
      if (stacksize === 0) {
        // we are at the top level and will stay there
        stack.push(level);
      } else if (level !== stack[stacksize - 1]) {
        // traverse the ancestry, looking for a match
        for (var j = stacksize - 1; j >= 0; j--) {
          if (level === stack[j]) {
            break; // found an ancestor
          }
        }
        if (j < 0) {
          // this is a new submenu item, lets push the stack
          stack.push(level);
          parentStack.push(lastItem);
        } else {
          // we are either a sibling or higher up the tree,
          // lets pop the stack if needed
          while (stack.length > j + 1) {
            stack.pop();
            parentStack.pop();
          }
        }
      }

      // for next iteration
      lastItem = item.link;

      // if we have a parent, lets record it
      if (parentStack.length > 0) {
        item.parents = [...parentStack];

        let temp: any = this.items;
        for (var t = 0; t < parentStack.length; ++t) {
          if (t < parentStack.length - 1) {
            temp = temp.filter((e: any) => { return e.link === parentStack[t]; })[0].children;
          } else {
            temp.filter((e: any) => { return e.link === parentStack[t]; })[0].children.push(item);
          }
        }
      } else {
        this.items.push(item);
      }

      this.itemsHash[item.link] = item;
    }

    setTimeout(() => {
      this.calculateHighlight();
    });
  }

  calculateHighlight() {
    var items: Array<any> = this.scrollSpyIndex.getIndex(this.scrollSpyIndexRenderOptions.id);
    this.itemsToHighlight = [];

    if (!items || !items.length) {
      return;
    }

    var highlightItem: string;
    for (var i = items.length - 1; i >= 0; i--) {
      if (this.currentScrollPosition - (items[i].offsetTop + this.scrollSpyIndexRenderOptions.topMargin) >= 0) {
        highlightItem = items[i].id;
        break;
      }
    }

    if (!highlightItem) {
      highlightItem = items[0].id;
    }
    this.itemsToHighlight = [highlightItem, ...this.itemsHash[highlightItem].parents];

    this.ref.markForCheck();
  }

  highlight(id: string): boolean {
    return this.itemsToHighlight.indexOf(id) !== -1;
  }

  goTo(anchor: string) {
    setTimeout(() => {
      document.querySelector('#' + anchor).scrollIntoView();
    });
  }

  ngOnDestroy() {
    this.changeStream$.unsubscribe();
    this.scrollStream$.unsubscribe();
  }
}
