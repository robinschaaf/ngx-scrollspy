import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core';

import { ScrollSpyService } from './core/service';
import { ScrollSpyDirective } from './core/window.directive';
import { ScrollSpyElementDirective } from './core/element.directive';

import { ScrollSpyIndexService } from './plugin/index.service';

export * from './core/service';
export * from './core/window.directive';
export * from './core/element.directive';
export * from './plugin/index.service';

@NgModule({
  declarations: [ ScrollSpyDirective, ScrollSpyElementDirective ],
  exports: [ ScrollSpyDirective, ScrollSpyElementDirective ]
})
export class ScrollSpyModule {
  constructor(@Optional() @SkipSelf() parentModule: ScrollSpyModule) {
    if (parentModule) {
      throw new Error(
        'ScrollSpyModule.forRoot() called twice. Lazy loaded modules should use ScrollSpyModule instead.',
      );
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ScrollSpyModule,
      providers: [
        ScrollSpyService,
        ScrollSpyIndexService
      ]
    };
  }
}
