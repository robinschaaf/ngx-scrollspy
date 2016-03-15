import {ScrollSpyService} from './src/service';
import {ScrollSpyDirective} from './src/window.directive';
import {ScrollSpyElementDirective} from './src/element.directive';

export * from './src/service';
export * from './src/window.directive';
export * from './src/element.directive';

export default {
  directives: [ScrollSpyDirective, ScrollSpyElementDirective],
  providers: [ScrollSpyService]
}
