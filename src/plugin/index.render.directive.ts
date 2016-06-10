import {
  Component,
  Injectable,
  Input,
  ElementRef,
  DynamicComponentLoader,
  OnInit,
  AfterViewInit,
  ComponentRef,
  ViewContainerRef,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';

import { ScrollSpyService } from '../index';
import { ScrollSpyIndexService } from './index.service';

export interface ScrollSpyIndexRenderOptions {
  id?: string;
  spyId?: string;
  topMargin?: number;
}

@Injectable()
@Component({
  selector: '[scrollSpyIndexRender]',
  template: `<div #container></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollSpyIndexRenderDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input('scrollSpyIndexRender') options: ScrollSpyIndexRenderOptions;
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;

  private defaultOptions: ScrollSpyIndexRenderOptions = {
    spyId: 'window',
    topMargin: 0
  };

  private changeStream$: any;
  private scrollStream$: any;

  private el: HTMLElement;
  private _children: Array<ComponentRef<any>> = [];

  private stack: Array<any> = [];
  private parentStack: Array<any> = [];
  private lastItem: any;

  private currentScrollPosition: number;
  private itemsToHighlight: Array<string> = [];

  constructor(
    private loader: DynamicComponentLoader,
    private elRef: ElementRef,
    private scrollSpy: ScrollSpyService,
    private scrollSpyIndex: ScrollSpyIndexService
  ) {
    this.el = elRef.nativeElement;
  }

  ngOnInit() {
    if (!this.options) {
      this.options = {};
    }

    if (!this.options.id) {
      return console.warn('ScrollSpyIndex: Missing id.');
    }

    this.options = Object.assign(this.defaultOptions, this.options);

    this.changeStream$ = this.scrollSpyIndex.changes$.subscribe((e: any) => {
      if (e.index === this.options.id) {
        if (e.change === 'delete') {
          this.update();
        } else if (e.change === 'set') {
          this.update();
        }
      }
    });
  }

  ngAfterViewInit() {
    if (!!this.scrollSpy.getObservable(this.options.spyId)) {
      this.scrollStream$ = this.scrollSpy.getObservable(this.options.spyId).subscribe((e: any) => {
        if (this.options.spyId === 'window') {
          this.currentScrollPosition = e.target.scrollingElement.scrollTop;
        } else {
          this.currentScrollPosition = e.target.scrollTop;
        }
        this.calculateHighlight();
      });
    } else {
      return console.warn('ScrollSpyIndexRender: No ScrollSpy observable for id "' + this.options.spyId + '"');
    }
  }

  update() {
    var items: Array<any> = this.scrollSpyIndex.getIndex(this.options.id) || [];
    var markup: string = '<ul class="nav menu">';

    for (var i = 0; i < items.length; i++) {
      var item = this.itemConstruct(items[i]);

      if (item.push) {
        markup += '<ul class="nav menu">';
      } else if (item.pop) {
        for (var j = 0; j < item.pop; j++) {
          markup += '</li></ul>';
        }
      } else if (i !== 0) {
        markup += '</li>';
      }

      markup += '<li [class.active]="highlight(\'' + item.link + '\')" pagemenuspy="' + item.link + '" parent="' + item.parent + '">';

      markup += '<a href="#' + item.link + '">';
      markup += item.text;
      markup += '</a>';
    }
    markup += '</ul>';

    this.removeChildren();
    this.loader.loadNextToLocation(
      this.compileToComponent(markup, [], () => this.getItemsToHighlight()),
      this.viewContainerRef
    ).then((ref: ComponentRef<any>) => {
        this._children.push(ref);
    });
    //getDOM().setInnerHTML(this.el, markup);
    setTimeout(() => {
      this.calculateHighlight();
    });
  }

  itemConstruct(data: any) {
    // parse basic info from the dom item
    var item: any = {
      link: data.id,
      text: data.textContent || data.innerText,
      parent: ''
    };

    // build type identifier
    var level: string = data.tagName;
    for (var i = 0; i < data.classList.length; i++) {
      level += ',' + data.classList[i];
    }

    // here be dragons
    var stacksize: number = this.stack.length;
    if (stacksize === 0) {
      // we are at the top level and will stay there
      this.stack.push(level);
    } else if (level !== this.stack[stacksize - 1]) {
      // traverse the ancestry, looking for a match
      for (var j = stacksize - 1; j >= 0; j--) {
        if (level === this.stack[j]) {
          break; // found an ancestor
        }
      }
      if (j < 0) {
        // this is a new submenu item, lets push the this.stack
        this.stack.push(level);
        item.push = true;
        this.parentStack.push(this.lastItem);
      } else {
        // we are either a sibling or higher up the tree,
        // lets pop the this.stack if needed
        item.pop = stacksize - 1 - j;
        while (this.stack.length > j + 1) {
          this.stack.pop();
          this.parentStack.pop();
        }
      }
    }

    // if we have a parent, lets record it
    if (this.parentStack.length > 0) {
      item.parent = this.parentStack[this.parentStack.length - 1];
    }

    // for next iteration
    this.lastItem = item.link;
    return item;
  }

  calculateHighlight() {
    var items: Array<any> = this.scrollSpyIndex.getIndex(this.options.id);
    this.itemsToHighlight = [];

    if (!items || !items.length) {
      return;
    }

    var highlightItem: string;
    for (var i = items.length - 1; i >= 0; i--) {
      if (this.currentScrollPosition - getDOM().getProperty(items[i], 'offsetTop') - this.options.topMargin >= 0) {
        highlightItem = items[i].id;
        break;
      }
    }

    if (!highlightItem) {
      highlightItem = items[0].id;
    }
    this.itemsToHighlight.push(highlightItem);

    while (!!highlightItem) {
      var item = getDOM().querySelector(this.el, '[pagemenuspy=' + highlightItem + ']');
      if (!!item) {
        var parent = getDOM().getAttribute(item, 'parent');
        if (parent) {
          highlightItem = parent;
          this.itemsToHighlight.push(highlightItem);
        } else {
          highlightItem = null;
        }
      } else {
        highlightItem = null;
      }
    }
  }

  getItemsToHighlight(): Array<string> {
    return this.itemsToHighlight;
  }

  compileToComponent(template: string, directives: Array<any>, itemsToHighlight: any): any {
    @Injectable()
    @Component({
      selector: 'scrollSpyMenu',
      template,
      directives
    })
    class FakeComponent {
      highlight(id: string): boolean {
        return itemsToHighlight().indexOf(id) !== -1;
      }
    };
    return FakeComponent;
  }

  removeChildren() {
    this._children.forEach(cmp => cmp.destroy());
    this._children = [];
  }

  ngOnDestroy() {
    this.changeStream$.unsubscribe();
    this.scrollStream$.unsubscribe();
  }
}
