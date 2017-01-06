import { NgModule } from '@angular/core';

export * from './affix.directive';

import { ScrollSpyAffixDirective } from './affix.directive';

@NgModule({
  declarations: [ ScrollSpyAffixDirective ],
  exports: [ ScrollSpyAffixDirective ]
})
export class ScrollSpyAffixModule {}