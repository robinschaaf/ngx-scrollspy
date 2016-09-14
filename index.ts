import { ScrollSpyService } from './src/core/service';
import { ScrollSpyDirective } from './src/core/window.directive';
import { ScrollSpyElementDirective } from './src/core/element.directive';

export * from './src/core/service';
export * from './src/core/window.directive';
export * from './src/core/element.directive';

export default {
  directives: [ ScrollSpyDirective, ScrollSpyElementDirective ],
  providers: [ ScrollSpyService ]
};
