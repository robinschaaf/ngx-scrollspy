import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { ScrollSpyService } from './src/core/service';
import { ScrollSpyDirective } from './src/core/window.directive';
import { ScrollSpyElementDirective } from './src/core/element.directive';

import { ScrollSpyIndexService } from './src/plugin/index.service';

export * from './src/core/service';
export * from './src/core/window.directive';
export * from './src/core/element.directive';

export default {
  directives: [ ScrollSpyDirective, ScrollSpyElementDirective ],
  providers: [ ScrollSpyService ]
};

@NgModule({
  declarations: [ ScrollSpyDirective ],
  exports: [ ScrollSpyDirective ]
})
export class ScrollSpyModule {
  constructor(@Optional() @SkipSelf() parentModule: ScrollSpyModule) {
    if (parentModule) {
      throw new Error('ScrollSpyModule already loaded; Import in root module only.');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ScrollSpyModule,
      providers: [ ScrollSpyService, ScrollSpyIndexService ]
    };
  }
}
