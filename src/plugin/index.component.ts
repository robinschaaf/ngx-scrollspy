import {
  NgModule,
  Component,
  Compiler,
  ChangeDetectorRef,
  Injectable,
  Input,
  ElementRef,
  ComponentFactoryResolver,
  OnInit,
  AfterViewInit,
  ViewContainerRef,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { ScrollSpyService } from '../index';
import { ScrollSpyIndexService } from './index.service';

export interface ScrollSpyIndexComponentOptions {
  id?: string;
  spyId?: string;
  topMargin?: number;
}

@Injectable()
@Component({
  selector: 'scrollSpy-index-render',
  template: `<div #container></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollSpyIndexRenderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public scrollSpyIndexRenderOptions: ScrollSpyIndexComponentOptions;

  public stack: Array<any> = [];
  public parentStack: Array<any> = [];
  public lastItem: any;

  public currentScrollPosition: number;
  public itemsToHighlight: Array<string> = [];
  
  @ViewChild('container', { read: ViewContainerRef })
  private viewContainerRef: ViewContainerRef;

  private defaultOptions: ScrollSpyIndexComponentOptions = {
    spyId: 'window',
    topMargin: 0
  };

  private changeStream$: any;
  private scrollStream$: any;

  private el: HTMLElement;

  constructor(
    private compiler: Compiler,
    private ref: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
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
        }
        this.calculateHighlight();
      });
    } else {
      return console.warn('ScrollSpyIndexComponent: No ScrollSpy observable for id "' + this.scrollSpyIndexRenderOptions.spyId + '"');
    }
  }

  update() {
    var items: Array<any> = this.scrollSpyIndex.getIndex(this.scrollSpyIndexRenderOptions.id) || [];
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

      // HACK: remove click once https://github.com/angular/angular/issues/6595 is fixed
      markup += '<a [routerLink]="" fragment="' + item.link + '" (click)="goTo(\'' + item.link + '\')">';
      markup += item.text;
      markup += '</a>';
    }
    markup += '</ul>';

    this.viewContainerRef.clear();
    let componentFactory = this.compileToComponent(markup, () => this.getItemsToHighlight());
    this.viewContainerRef.createComponent(componentFactory);

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
    this.itemsToHighlight.push(highlightItem);

    while (!!highlightItem) {
      var item = this.el.querySelector('[pagemenuspy=' + highlightItem + ']');
      if (!!item) {
        var parent = item.getAttribute('parent');
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

    this.ref.markForCheck();
  }

  getItemsToHighlight(): Array<string> {
    return this.itemsToHighlight;
  }

  compileToComponent(template: string, itemsToHighlight: any): any {
    @Injectable()
    @Component({
      selector: 'scrollSpyMenu',
      template
    })
    class RenderComponent {
      highlight(id: string): boolean {
        return itemsToHighlight().indexOf(id) !== -1;
      }

      // HACK: remove click once https://github.com/angular/angular/issues/6595 is fixed
      goTo(anchor: string) {
        setTimeout(() => {
            document.querySelector('#' + anchor).scrollIntoView();
        });
      }
    };

    @NgModule({imports: [RouterModule], declarations: [RenderComponent]})
    class RenderModule {}

    return this.compiler.compileModuleAndAllComponentsSync(RenderModule)
      .componentFactories.find((comp) =>
        comp.componentType === RenderComponent
      );
  }

  ngOnDestroy() {
    this.changeStream$.unsubscribe();
    this.scrollStream$.unsubscribe();
  }
}
