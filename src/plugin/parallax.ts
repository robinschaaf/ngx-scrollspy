import { NgModule } from '@angular/core';

export * from './parallax.directive';

import { ScrollSpyParallaxDirective } from './parallax.directive';

@NgModule({
  declarations: [ ScrollSpyParallaxDirective ],
  exports: [ ScrollSpyParallaxDirective ]
})
export class  ScrollSpyParallaxModule {}
