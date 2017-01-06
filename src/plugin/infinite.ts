import { NgModule } from '@angular/core';

export * from './infinite.directive';

import { ScrollSpyInfiniteDirective } from './infinite.directive';

@NgModule({
  declarations: [ ScrollSpyInfiniteDirective ],
  exports: [ ScrollSpyInfiniteDirective ]
})
export class  ScrollSpyInfiniteModule {}