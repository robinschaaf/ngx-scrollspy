import {
  NgModule,
  ModuleWithProviders,
  Inject,
  Optional,
  OpaqueToken,
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

export const NG2SCROLLSPY_FORROOT_GUARD = new OpaqueToken('NG2SCROLLSPY_FORROOT_GUARD');
export function provideForRootGuard(scrollSpyService: ScrollSpyService): any {
  if (scrollSpyService) {
    throw new Error(
      `ScrollSpyModule.forRoot() called twice. Lazy loaded modules should declare directives directly.`);
  }
  return 'guarded';
}

@NgModule({
  declarations: [ ScrollSpyDirective, ScrollSpyElementDirective ],
  exports: [ ScrollSpyDirective, ScrollSpyElementDirective ]
})
export class ScrollSpyModule {
  constructor(@Optional() @Inject(NG2SCROLLSPY_FORROOT_GUARD) guard: any) {}

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ScrollSpyModule,
      providers: [
        {
          provide: NG2SCROLLSPY_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[ScrollSpyService, new Optional(), new SkipSelf()]]
        },
        ScrollSpyService,
        ScrollSpyIndexService
      ]
    };
  }
}
