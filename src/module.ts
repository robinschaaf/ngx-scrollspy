import { NgModule, ModuleWithProviders } from '@angular/core';

import { ScrollSpyService } from './core/service';
import { ScrollSpyDirective } from './core/window.directive';
import { ScrollSpyElementDirective } from './core/element.directive';

import { ScrollSpyIndexService } from './plugin/index.service';

@NgModule({
  declarations: [ ScrollSpyDirective, ScrollSpyElementDirective ],
  exports: [ ScrollSpyDirective, ScrollSpyElementDirective ]
})
export class ScrollSpyModule {
  constructor() {}

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
