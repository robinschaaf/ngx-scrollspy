import { ScrollSpyService } from './core/service';
import { ScrollSpyDirective } from './core/window.directive';
import { ScrollSpyElementDirective } from './core/element.directive';

export * from './core/service';
export * from './core/window.directive';
export * from './core/element.directive';

export default {
  directives: [ ScrollSpyDirective, ScrollSpyElementDirective ],
  providers: [ ScrollSpyService ]
};
